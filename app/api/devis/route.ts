import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    let query = 'SELECT * FROM devis ORDER BY created_at DESC'
    const params: any[] = []
    
    if (status || search) {
      const conditions = []
      
      if (status) {
        conditions.push('status = $' + (params.length + 1))
        params.push(status)
      }
      
      if (search) {
        conditions.push('(client_name ILIKE $' + (params.length + 1) + ' OR reference ILIKE $' + (params.length + 1) + ')')
        params.push(`%${search}%`)
      }
      
      query = 'SELECT * FROM devis WHERE ' + conditions.join(' AND ') + ' ORDER BY created_at DESC'
    }
    
    const result = await pool.query(query, params)
    
    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching devis:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch devis' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      reference,
      client_name,
      client_email,
      service,
      features,
      amount,
      deadline,
      project_description
    } = body
    
    if (!reference || !client_name || !client_email || !service || !amount || !deadline) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const query = `
      INSERT INTO devis (reference, client_name, client_email, service, features, amount, deadline, project_description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `
    
    const values = [reference, client_name, client_email, service, features || [], amount, deadline, project_description || null]
    const result = await pool.query(query, values)
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating devis:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create devis' },
      { status: 500 }
    )
  }
}
