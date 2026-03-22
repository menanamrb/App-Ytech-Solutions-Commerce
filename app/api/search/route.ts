import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          devis: [],
          packOrders: [],
          messages: []
        }
      })
    }
    
    const searchQuery = `%${query.toLowerCase()}%`
    
    // Rechercher dans les devis
    const devisQuery = `
      SELECT id, reference, client_name, client_email, service, amount, status, created_at, 'devis' as type
      FROM devis 
      WHERE LOWER(client_name) LIKE $1 OR LOWER(service) LIKE $1 OR LOWER(reference) LIKE $1
      ORDER BY created_at DESC
      LIMIT 5
    `
    
    // Rechercher dans les commandes de packs
    const packOrdersQuery = `
      SELECT id, pack_name, client_name, client_email, pack_price, status, created_at, 'pack_order' as type
      FROM pack_orders 
      WHERE LOWER(client_name) LIKE $1 OR LOWER(pack_name) LIKE $1 OR LOWER(client_email) LIKE $1
      ORDER BY created_at DESC
      LIMIT 5
    `
    
    // Rechercher dans les messages
    const messagesQuery = `
      SELECT id, name, email, subject, message, priority, status, created_at, 'message' as type
      FROM contact_messages 
      WHERE LOWER(name) LIKE $1 OR LOWER(email) LIKE $1 OR LOWER(message) LIKE $1 OR LOWER(COALESCE(subject, '')) LIKE $1
      ORDER BY created_at DESC
      LIMIT 5
    `
    
    const [devisResult, packOrdersResult, messagesResult] = await Promise.all([
      pool.query(devisQuery, [searchQuery]),
      pool.query(packOrdersQuery, [searchQuery]),
      pool.query(messagesQuery, [searchQuery])
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        devis: devisResult.rows,
        packOrders: packOrdersResult.rows,
        messages: messagesResult.rows
      }
    })
    
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}
