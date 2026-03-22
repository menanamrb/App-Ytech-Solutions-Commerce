import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const messageDate = new Date(date)
  const diffInMs = now.getTime() - messageDate.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (diffInHours < 1) {
    return "Il y a quelques minutes"
  } else if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`
  } else if (diffInDays === 1) {
    return "Hier"
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays} jours`
  } else {
    return messageDate.toLocaleDateString('fr-FR')
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    
    let query = `
      SELECT id, name, email, phone, company, pack, budget, message, status, priority, created_at, updated_at
      FROM contact_messages
    `
    
    const queryParams: any[] = []
    const conditions: string[] = []
    
    if (status) {
      conditions.push(`status = $${queryParams.length + 1}`)
      queryParams.push(status)
    }
    
    if (priority) {
      conditions.push(`priority = $${queryParams.length + 1}`)
      queryParams.push(priority)
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    
    query += ' ORDER BY created_at DESC'
    
    const result = await pool.query(query, queryParams)
    
    // Formatter les dates pour l'affichage
    const messages = result.rows.map(row => ({
      ...row,
      date: formatRelativeTime(row.created_at),
      subject: row.pack || `Demande de contact`,
      client: row.company || row.name
    }))
    
    return NextResponse.json({
      success: true,
      data: messages
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, email, phone, company, pack, budget, message } = body
    
    // Validation basique
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Les champs nom, email, téléphone et message sont obligatoires' },
        { status: 400 }
      )
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Déterminer la priorité selon le pack
    let priority = 'medium'
    if (pack && pack.includes('Enterprise')) {
      priority = 'high'
    } else if (pack && pack.includes('Starter')) {
      priority = 'low'
    }

    const query = `
      INSERT INTO contact_messages (name, email, phone, company, pack, budget, message, priority)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at
    `
    
    const values = [name, email, phone, company || null, pack || null, budget || null, message, priority]
    
    const result = await pool.query(query, values)
    
    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès',
      data: {
        id: result.rows[0].id,
        created_at: result.rows[0].created_at
      }
    })
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi du message' },
      { status: 500 }
    )
  }
}
