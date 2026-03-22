import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import pool from '@/lib/db'

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Fonction pour envoyer l'email de confirmation
async function sendConfirmationEmail(orderData: any) {
  try {
    console.log('Tentative d\'envoi d\'email à:', orderData.client_email)

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: orderData.client_email,
      subject: `Confirmation de commande - Pack ${orderData.pack_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px;">Ytech Solutions</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Confirmation de commande</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0; margin-bottom: 20px;">Merci pour votre commande !</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Nous avons bien reçu votre commande pour le pack <strong>${orderData.pack_name}</strong>. 
              Voici le récapitulatif de votre commande :
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Détails de la commande</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Pack :</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.pack_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Prix :</td>
                  <td style="padding: 8px 0; color: #333;">${parseFloat(orderData.pack_price).toLocaleString('fr-FR')} DHS</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Client :</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.client_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Email :</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.client_email}</td>
                </tr>
                ${orderData.client_phone ? `
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Téléphone :</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.client_phone}</td>
                </tr>` : ''}
                ${orderData.client_company ? `
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Entreprise :</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.client_company}</td>
                </tr>` : ''}
                ${orderData.client_city ? `
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Ville :</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.client_city}</td>
                </tr>` : ''}
                ${orderData.project_description ? `
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold; vertical-align: top;">Description :</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.project_description}</td>
                </tr>` : ''}
              </table>
              
              ${orderData.pack_features && orderData.pack_features.length > 0 ? `
              <h4 style="color: #333; margin-top: 20px; margin-bottom: 10px;">Fonctionnalités incluses :</h4>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                ${orderData.pack_features.map((feature: string) => `<li style="margin-bottom: 5px;">${feature}</li>`).join('')}
              </ul>` : ''}
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #1976d2; font-weight: 500;">
                <strong>Prochaines étapes :</strong><br>
                Notre équipe va étudier votre demande et vous contacter dans les plus brefs délais pour finaliser les détails de votre projet.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0;">Cordialement,</p>
            <p style="color: #333; margin: 5px 0 0 0; font-weight: bold;">L'équipe Ytech Solutions</p>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">
              Email : ${process.env.SMTP_USER}<br>
              Téléphone : +212 5XX-XXXXXX
            </p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error as Error)
    return false
  }
}

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id, pack_id, pack_name, pack_price, pack_features,
        client_name, client_email, client_phone, client_company, client_city,
        project_description, status, is_validated, payment_status,
        validated_at, paid_at, created_at, updated_at
      FROM pack_orders 
      ORDER BY created_at DESC
    `)
    
    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('GET /api/pack-orders error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pack orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      pack_id,
      pack_name,
      pack_price,
      pack_features,
      client_name,
      client_email,
      client_phone,
      client_company,
      client_city,
      project_description
    } = body
    
    // Validation
    if (!pack_id || !pack_name || !pack_price || !client_name || !client_email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Insérer dans la base de données
    const result = await pool.query(`
      INSERT INTO pack_orders (
        pack_id, pack_name, pack_price, pack_features,
        client_name, client_email, client_phone, client_company, client_city,
        project_description, status, is_validated, payment_status,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `, [
      pack_id, pack_name, pack_price, JSON.stringify(pack_features),
      client_name, client_email, client_phone, client_company, client_city,
      project_description, 'pending', false, 'pending'
    ])
    
    // Créer l'objet de commande pour l'email
    const orderData = {
      pack_id,
      pack_name,
      pack_price,
      pack_features,
      client_name,
      client_email,
      client_phone,
      client_company,
      client_city,
      project_description
    }
    
    // Envoyer l'email de confirmation
    const emailSent = await sendConfirmationEmail(orderData)
    
    if (!emailSent) {
      console.error('Échec de l\'envoi de l\'email de confirmation')
    }
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('POST /api/pack-orders error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create pack order' },
      { status: 500 }
    )
  }
}
