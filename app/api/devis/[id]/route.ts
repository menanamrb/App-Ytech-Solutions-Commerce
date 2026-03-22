import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    console.log('API PUT - ID reçu:', id, 'Type:', typeof id)
    
    const body = await request.json()
    const { status } = body
    
    if (!status || !['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      )
    }
    
    const query = `
      UPDATE devis 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `
    
    const result = await pool.query(query, [status, parseInt(id)])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Devis not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating devis:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update devis' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const query = 'DELETE FROM devis WHERE id = $1 RETURNING *'
    const result = await pool.query(query, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Devis not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Devis deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting devis:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete devis' },
      { status: 500 }
    )
  }
}
