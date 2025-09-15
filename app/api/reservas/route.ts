import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"
import { z } from "zod"

// Schema de validação para reservas
const reservaSchema = z.object({
  cliente_id: z.string().uuid("ID do cliente inválido"),
  quadra_id: z.string().uuid("ID da quadra inválido"),
  professor_id: z.string().uuid().optional(),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  data_inicio: z.string().datetime("Data de início inválida"),
  data_fim: z.string().datetime("Data de fim inválida"),
  valor_total: z.number().positive("Valor deve ser positivo"),
  status: z.enum(["pendente", "confirmada", "cancelada", "concluida"]).default("pendente"),
  observacoes: z.string().optional()
})

// GET - Listar reservas com filtros
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const data_inicio = searchParams.get('data_inicio')
    const data_fim = searchParams.get('data_fim')
    const quadra_id = searchParams.get('quadra_id')

    // Construir query base
    let query = supabase
      .from('reservas')
      .select(`
        *,
        cliente:profiles!reservas_cliente_id_fkey(nome, email, telefone),
        quadra:quadras(nome, tipo, preco_hora),
        professor:profiles!reservas_professor_id_fkey(nome, email)
      `)
      .order('data_inicio', { ascending: false })

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status)
    }
    
    if (data_inicio) {
      query = query.gte('data_inicio', data_inicio)
    }
    
    if (data_fim) {
      query = query.lte('data_fim', data_fim)
    }
    
    if (quadra_id) {
      query = query.eq('quadra_id', quadra_id)
    }

    // Aplicar paginação
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: reservas, error, count } = await query

    if (error) {
      console.error('Erro ao buscar reservas:', error)
      return NextResponse.json({ 
        ok: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      data: reservas,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error: any) {
    console.error('Erro na API de reservas:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// POST - Criar nova reserva
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validar dados
    const validatedData = reservaSchema.parse(body)

    // Verificar disponibilidade da quadra
    const { data: conflito } = await supabase
      .from('reservas')
      .select('id')
      .eq('quadra_id', validatedData.quadra_id)
      .eq('status', 'confirmada')
      .or(`and(data_inicio.lt.${validatedData.data_fim},data_fim.gt.${validatedData.data_inicio})`)

    if (conflito && conflito.length > 0) {
      return NextResponse.json({
        ok: false,
        error: 'Quadra já está reservada neste horário'
      }, { status: 409 })
    }

    // Verificar se o cliente existe
    const { data: cliente } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', validatedData.cliente_id)
      .single()

    if (!cliente) {
      return NextResponse.json({
        ok: false,
        error: 'Cliente não encontrado'
      }, { status: 404 })
    }

    // Verificar se a quadra existe
    const { data: quadra } = await supabase
      .from('quadras')
      .select('id, preco_hora')
      .eq('id', validatedData.quadra_id)
      .eq('ativo', true)
      .single()

    if (!quadra) {
      return NextResponse.json({
        ok: false,
        error: 'Quadra não encontrada ou inativa'
      }, { status: 404 })
    }

    // Calcular valor total se não fornecido
    if (!validatedData.valor_total) {
      const inicio = new Date(validatedData.data_inicio)
      const fim = new Date(validatedData.data_fim)
      const horas = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60)
      validatedData.valor_total = horas * quadra.preco_hora
    }

    // Criar reserva
    const { data: novaReserva, error } = await supabase
      .from('reservas')
      .insert({
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        cliente:profiles!reservas_cliente_id_fkey(nome, email, telefone),
        quadra:quadras(nome, tipo, preco_hora),
        professor:profiles!reservas_professor_id_fkey(nome, email)
      `)
      .single()

    if (error) {
      console.error('Erro ao criar reserva:', error)
      return NextResponse.json({
        ok: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      data: novaReserva,
      message: 'Reserva criada com sucesso'
    }, { status: 201 })

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        ok: false,
        error: 'Dados inválidos',
        details: error.errors
      }, { status: 400 })
    }

    console.error('Erro na API de reservas:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// PUT - Atualizar reserva
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        ok: false,
        error: 'ID da reserva é obrigatório'
      }, { status: 400 })
    }

    const body = await req.json()
    
    // Validar dados (campos opcionais para atualização)
    const updateSchema = reservaSchema.partial()
    const validatedData = updateSchema.parse(body)

    // Verificar se a reserva existe
    const { data: reservaExistente } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', id)
      .single()

    if (!reservaExistente) {
      return NextResponse.json({
        ok: false,
        error: 'Reserva não encontrada'
      }, { status: 404 })
    }

    // Se está mudando horário/quadra, verificar disponibilidade
    if (validatedData.quadra_id || validatedData.data_inicio || validatedData.data_fim) {
      const quadra_id = validatedData.quadra_id || reservaExistente.quadra_id
      const data_inicio = validatedData.data_inicio || reservaExistente.data_inicio
      const data_fim = validatedData.data_fim || reservaExistente.data_fim

      const { data: conflito } = await supabase
        .from('reservas')
        .select('id')
        .eq('quadra_id', quadra_id)
        .eq('status', 'confirmada')
        .neq('id', id)
        .or(`and(data_inicio.lt.${data_fim},data_fim.gt.${data_inicio})`)

      if (conflito && conflito.length > 0) {
        return NextResponse.json({
          ok: false,
          error: 'Quadra já está reservada neste horário'
        }, { status: 409 })
      }
    }

    // Atualizar reserva
    const { data: reservaAtualizada, error } = await supabase
      .from('reservas')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        cliente:profiles!reservas_cliente_id_fkey(nome, email, telefone),
        quadra:quadras(nome, tipo, preco_hora),
        professor:profiles!reservas_professor_id_fkey(nome, email)
      `)
      .single()

    if (error) {
      console.error('Erro ao atualizar reserva:', error)
      return NextResponse.json({
        ok: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      data: reservaAtualizada,
      message: 'Reserva atualizada com sucesso'
    })

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        ok: false,
        error: 'Dados inválidos',
        details: error.errors
      }, { status: 400 })
    }

    console.error('Erro na API de reservas:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// DELETE - Cancelar reserva
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        ok: false,
        error: 'ID da reserva é obrigatório'
      }, { status: 400 })
    }

    // Verificar se a reserva existe
    const { data: reserva } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', id)
      .single()

    if (!reserva) {
      return NextResponse.json({
        ok: false,
        error: 'Reserva não encontrada'
      }, { status: 404 })
    }

    // Verificar se pode ser cancelada
    if (reserva.status === 'concluida') {
      return NextResponse.json({
        ok: false,
        error: 'Não é possível cancelar uma reserva já concluída'
      }, { status: 400 })
    }

    // Cancelar reserva (soft delete)
    const { error } = await supabase
      .from('reservas')
      .update({
        status: 'cancelada',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao cancelar reserva:', error)
      return NextResponse.json({
        ok: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Reserva cancelada com sucesso'
    })

  } catch (error: any) {
    console.error('Erro na API de reservas:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

