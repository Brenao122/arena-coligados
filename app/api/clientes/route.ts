import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"
import { z } from "zod"

// Schema de validação para clientes
const clienteSchema = z.object({
  email: z.string().email("Email inválido"),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().optional(),
  data_nascimento: z.string().optional(),
  endereco: z.object({
    rua: z.string().optional(),
    numero: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    cep: z.string().optional()
  }).optional(),
  avatar_url: z.string().url().optional(),
  role: z.enum(["cliente", "professor", "admin"]).default("cliente"),
  ativo: z.boolean().default(true)
})

// GET - Listar clientes com filtros
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const role = searchParams.get('role')
    const ativo = searchParams.get('ativo')

    // Construir query base
    let query = supabase
      .from('profiles')
      .select(`
        *,
        reservas:reservas(count),
        ultima_reserva:reservas(data_inicio, status)
      `)
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (search) {
      query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`)
    }
    
    if (role) {
      query = query.eq('role', role)
    }
    
    if (ativo !== null && ativo !== undefined) {
      query = query.eq('ativo', ativo === 'true')
    }

    // Aplicar paginação
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: clientes, error, count } = await query

    if (error) {
      console.error('Erro ao buscar clientes:', error)
      return NextResponse.json({ 
        ok: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      data: clientes,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error: any) {
    console.error('Erro na API de clientes:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// POST - Criar novo cliente
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validar dados
    const validatedData = clienteSchema.parse(body)

    // Verificar se o email já existe
    const { data: clienteExistente } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (clienteExistente) {
      return NextResponse.json({
        ok: false,
        error: 'Email já está em uso'
      }, { status: 409 })
    }

    // Gerar ID único
    const clienteId = crypto.randomUUID()

    // Criar cliente
    const { data: novoCliente, error } = await supabase
      .from('profiles')
      .insert({
        id: clienteId,
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar cliente:', error)
      return NextResponse.json({
        ok: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      data: novoCliente,
      message: 'Cliente criado com sucesso'
    }, { status: 201 })

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        ok: false,
        error: 'Dados inválidos',
        details: error.errors
      }, { status: 400 })
    }

    console.error('Erro na API de clientes:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// PUT - Atualizar cliente
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        ok: false,
        error: 'ID do cliente é obrigatório'
      }, { status: 400 })
    }

    const body = await req.json()
    
    // Validar dados (campos opcionais para atualização)
    const updateSchema = clienteSchema.partial()
    const validatedData = updateSchema.parse(body)

    // Verificar se o cliente existe
    const { data: clienteExistente } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (!clienteExistente) {
      return NextResponse.json({
        ok: false,
        error: 'Cliente não encontrado'
      }, { status: 404 })
    }

    // Se está mudando email, verificar se não existe outro com o mesmo email
    if (validatedData.email && validatedData.email !== clienteExistente.email) {
      const { data: emailExistente } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', validatedData.email)
        .neq('id', id)
        .single()

      if (emailExistente) {
        return NextResponse.json({
          ok: false,
          error: 'Email já está em uso por outro cliente'
        }, { status: 409 })
      }
    }

    // Atualizar cliente
    const { data: clienteAtualizado, error } = await supabase
      .from('profiles')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar cliente:', error)
      return NextResponse.json({
        ok: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      data: clienteAtualizado,
      message: 'Cliente atualizado com sucesso'
    })

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        ok: false,
        error: 'Dados inválidos',
        details: error.errors
      }, { status: 400 })
    }

    console.error('Erro na API de clientes:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// DELETE - Desativar cliente (soft delete)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        ok: false,
        error: 'ID do cliente é obrigatório'
      }, { status: 400 })
    }

    // Verificar se o cliente existe
    const { data: cliente } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (!cliente) {
      return NextResponse.json({
        ok: false,
        error: 'Cliente não encontrado'
      }, { status: 404 })
    }

    // Verificar se tem reservas ativas
    const { data: reservasAtivas } = await supabase
      .from('reservas')
      .select('id')
      .eq('cliente_id', id)
      .eq('status', 'confirmada')
      .gte('data_inicio', new Date().toISOString())

    if (reservasAtivas && reservasAtivas.length > 0) {
      return NextResponse.json({
        ok: false,
        error: 'Não é possível desativar cliente com reservas ativas'
      }, { status: 400 })
    }

    // Desativar cliente
    const { error } = await supabase
      .from('profiles')
      .update({
        ativo: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao desativar cliente:', error)
      return NextResponse.json({
        ok: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Cliente desativado com sucesso'
    })

  } catch (error: any) {
    console.error('Erro na API de clientes:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

