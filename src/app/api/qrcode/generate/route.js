// app/api/qrcode/generate/route.js
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Extract form data
    const url = formData.get('url');
    const fgColor = formData.get('fgColor');
    const bgColor = formData.get('bgColor');
    const size = parseInt(formData.get('size'));
    const errorLevel = formData.get('errorLevel');
    const logoFile = formData.get('logo');

    // Generate base QR code
    let qrBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: errorLevel,
      width: size,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
        transparent: bgColor === 'transparent' ? '#00000000' : undefined
      }
    });

    // Add logo overlay
    if (logoFile) {
      const logoBuffer = Buffer.from(await logoFile.arrayBuffer());
      const logoSize = Math.round(size * 0.2);
      
      const logo = await sharp(logoBuffer)
        .resize(logoSize, logoSize, { 
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toBuffer();

      qrBuffer = await sharp(qrBuffer)
        .composite([{ 
          input: logo,
          gravity: 'center',
          blend: 'over' 
        }])
        .toBuffer();
    }

    // Generate formats
    const pngBuffer = await sharp(qrBuffer).png().toBuffer();
    const svgString = await QRCode.toString(url, {
      type: 'svg',
      errorCorrectionLevel: errorLevel,
      color: {
        dark: fgColor,
        light: bgColor
      }
    });

    // PDF Generation
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([size + 50, size + 50]);
    const pngImage = await pdfDoc.embedPng(pngBuffer);
    page.drawImage(pngImage, {
      x: 25,
      y: 25,
      width: size,
      height: size,
    });
    const pdfBytes = await pdfDoc.save();

    return NextResponse.json({
      formats: {
        png: `data:image/png;base64,${pngBuffer.toString('base64')}`,
        svg: `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`,
        pdf: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`
      }
    });

  } catch (error) {
    console.error('QR Generation Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}