import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase/server-client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST - Popular dados de teste
export async function POST() {
  try {
    const supabase = await getServerClient()
    
    console.log('🚀 Iniciando população de dados de teste...')

    // =============================================
    // LIMPAR DADOS EXISTENTES
    // =============================================
    console.log('🧹 Limpando dados existentes...')
    
    await supabase.from('reservas').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('pagamentos').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('leads').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('profiles').delete().eq('role', 'cliente')
    await supabase.from('profiles').delete().eq('role', 'professor')
    await supabase.from('quadras').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // =============================================
    // INSERIR QUADRAS
    // =============================================
    console.log('🏟️ Inserindo quadras...')
    
    const { data: quadras, error: quadrasError } = await supabase
      .from('quadras')
      .insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'Quadra 1 - Matriz',
          tipo: 'Beach Tennis',
          capacidade: 6,
          preco_hora: 80.00,
          descricao: 'Quadra de Beach Tennis com areia premium',
          regras: 'Capacidade máxima de 6 pessoas',
          equipamentos: ['Rede oficial', 'Raquetes', 'Bolas'],
          ativo: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          nome: 'Quadra 2 - Matriz',
          tipo: 'Vôlei',
          capacidade: 10,
          preco_hora: 80.00,
          descricao: 'Quadra de Vôlei com piso profissional',
          regras: 'Capacidade máxima de 10 pessoas',
          equipamentos: ['Rede oficial', 'Bolas oficiais'],
          ativo: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          nome: 'Quadra 3 - Matriz',
          tipo: 'Futevôlei',
          capacidade: 10,
          preco_hora: 80.00,
          descricao: 'Quadra de Futevôlei com areia especial',
          regras: 'Capacidade máxima de 10 pessoas',
          equipamentos: ['Rede regulamentada', 'Bolas oficiais'],
          ativo: true
        }
      ])
      .select()

    if (quadrasError) {
      throw new Error(`Erro ao inserir quadras: ${quadrasError.message}`)
    }

    console.log(`✅ ${quadras?.length} quadras inseridas`)

    // =============================================
    // INSERIR PROFILES (CLIENTES E PROFESSORES)
    // =============================================
    console.log('👥 Inserindo profiles...')
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .insert([
        // Clientes
        {
          id: '650e8400-e29b-41d4-a716-446655440001',
          email: 'joao.silva@email.com',
          nome: 'João Silva Santos',
          telefone: '(62) 99999-1111',
          data_nascimento: '1990-05-15',
          endereco: {
            rua: 'Rua das Flores, 123',
            bairro: 'Centro',
            cidade: 'Goiânia',
            estado: 'GO',
            cep: '74000-000'
          },
          role: 'cliente',
          ativo: true
        },
        {
          id: '650e8400-e29b-41d4-a716-446655440002',
          email: 'maria.santos@email.com',
          nome: 'Maria Santos Oliveira',
          telefone: '(62) 99999-2222',
          data_nascimento: '1985-08-22',
          endereco: {
            rua: 'Av. Goiás, 456',
            bairro: 'Setor Oeste',
            cidade: 'Goiânia',
            estado: 'GO',
            cep: '74100-000'
          },
          role: 'cliente',
          ativo: true
        },
        {
          id: '650e8400-e29b-41d4-a716-446655440003',
          email: 'carlos.lima@email.com',
          nome: 'Carlos Eduardo Lima',
          telefone: '(62) 99999-3333',
          data_nascimento: '1992-12-03',
          endereco: {
            rua: 'Rua 7, 789',
            bairro: 'Setor Marista',
            cidade: 'Goiânia',
            estado: 'GO',
            cep: '74200-000'
          },
          role: 'cliente',
          ativo: true
        },
        {
          id: '650e8400-e29b-41d4-a716-446655440004',
          email: 'ana.costa@email.com',
          nome: 'Ana Paula Costa',
          telefone: '(62) 99999-4444',
          data_nascimento: '1988-07-18',
          endereco: {
            rua: 'Av. T-10, 321',
            bairro: 'Setor Bueno',
            cidade: 'Goiânia',
            estado: 'GO',
            cep: '74300-000'
          },
          role: 'cliente',
          ativo: true
        },
        {
          id: '650e8400-e29b-41d4-a716-446655440005',
          email: 'pedro.oliveira@email.com',
          nome: 'Pedro Oliveira Silva',
          telefone: '(62) 99999-5555',
          data_nascimento: '1995-03-25',
          endereco: {
            rua: 'Rua 15, 654',
            bairro: 'Setor Sul',
            cidade: 'Goiânia',
            estado: 'GO',
            cep: '74400-000'
          },
          role: 'cliente',
          ativo: true
        },
        // Professores
        {
          id: '750e8400-e29b-41d4-a716-446655440001',
          email: 'rafael.professor@arenacoligados.com.br',
          nome: 'Rafael Henrique Professor',
          telefone: '(62) 99999-6666',
          data_nascimento: '1980-04-12',
          endereco: {
            rua: 'Rua das Palmeiras, 654',
            bairro: 'Jardim América',
            cidade: 'Goiânia',
            estado: 'GO',
            cep: '74400-000'
          },
          role: 'professor',
          ativo: true
        },
        {
          id: '750e8400-e29b-41d4-a716-446655440002',
          email: 'lucia.professora@arenacoligados.com.br',
          nome: 'Lucia Maria Professora',
          telefone: '(62) 99999-7777',
          data_nascimento: '1982-09-08',
          endereco: {
            rua: 'Av. Universitária, 321',
            bairro: 'Setor Leste',
            cidade: 'Goiânia',
            estado: 'GO',
            cep: '74500-000'
          },
          role: 'professor',
          ativo: true
        }
      ])
      .select()

    if (profilesError) {
      throw new Error(`Erro ao inserir profiles: ${profilesError.message}`)
    }

    console.log(`✅ ${profiles?.length} profiles inseridos`)

    // =============================================
    // INSERIR RESERVAS
    // =============================================
    console.log('📅 Inserindo reservas...')
    
    const { data: reservas, error: reservasError } = await supabase
      .from('reservas')
      .insert([
        {
          id: '850e8400-e29b-41d4-a716-446655440001',
          cliente_id: '650e8400-e29b-41d4-a716-446655440001',
          quadra_id: '550e8400-e29b-41d4-a716-446655440001',
          professor_id: '750e8400-e29b-41d4-a716-446655440001',
          tipo: 'aula',
          data_inicio: '2025-01-20T14:00:00.000Z',
          data_fim: '2025-01-20T15:00:00.000Z',
          valor_total: 80.00,
          status: 'confirmada',
          observacoes: 'Aula de Beach Tennis - Quadra 1'
        },
        {
          id: '850e8400-e29b-41d4-a716-446655440002',
          cliente_id: '650e8400-e29b-41d4-a716-446655440001',
          quadra_id: '550e8400-e29b-41d4-a716-446655440002',
          professor_id: null,
          tipo: 'locacao',
          data_inicio: '2025-01-21T16:00:00.000Z',
          data_fim: '2025-01-21T18:00:00.000Z',
          valor_total: 160.00,
          status: 'pendente',
          observacoes: 'Locação Quadra 2 - Vôlei'
        },
        {
          id: '850e8400-e29b-41d4-a716-446655440003',
          cliente_id: '650e8400-e29b-41d4-a716-446655440002',
          quadra_id: '550e8400-e29b-41d4-a716-446655440003',
          professor_id: '750e8400-e29b-41d4-a716-446655440002',
          tipo: 'aula',
          data_inicio: '2025-01-22T10:00:00.000Z',
          data_fim: '2025-01-22T11:00:00.000Z',
          valor_total: 80.00,
          status: 'confirmada',
          observacoes: 'Aula de Futevôlei - Quadra 3'
        },
        {
          id: '850e8400-e29b-41d4-a716-446655440004',
          cliente_id: '650e8400-e29b-41d4-a716-446655440003',
          quadra_id: '550e8400-e29b-41d4-a716-446655440001',
          professor_id: null,
          tipo: 'locacao',
          data_inicio: '2025-01-23T19:00:00.000Z',
          data_fim: '2025-01-23T21:00:00.000Z',
          valor_total: 160.00,
          status: 'confirmada',
          observacoes: 'Locação Quadra 1 - Beach Tennis'
        },
        {
          id: '850e8400-e29b-41d4-a716-446655440005',
          cliente_id: '650e8400-e29b-41d4-a716-446655440004',
          quadra_id: '550e8400-e29b-41d4-a716-446655440002',
          professor_id: '750e8400-e29b-41d4-a716-446655440001',
          tipo: 'aula',
          data_inicio: '2025-01-24T15:00:00.000Z',
          data_fim: '2025-01-24T16:00:00.000Z',
          valor_total: 80.00,
          status: 'pendente',
          observacoes: 'Aula de Vôlei - Quadra 2'
        }
      ])
      .select()

    if (reservasError) {
      throw new Error(`Erro ao inserir reservas: ${reservasError.message}`)
    }

    console.log(`✅ ${reservas?.length} reservas inseridas`)

    // =============================================
    // INSERIR LEADS
    // =============================================
    console.log('🎯 Inserindo leads...')
    
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .insert([
        {
          id: '950e8400-e29b-41d4-a716-446655440001',
          nome: 'Roberto Alves',
          email: 'roberto.alves@email.com',
          telefone: '(62) 99999-8888',
          interesse: 'Aula de Beach Tennis',
          origem: 'instagram',
          status: 'novo',
          observacoes: 'Interessado em aulas particulares'
        },
        {
          id: '950e8400-e29b-41d4-a716-446655440002',
          nome: 'Fernanda Lima',
          email: 'fernanda.lima@email.com',
          telefone: '(62) 99999-9999',
          interesse: 'Locação de quadra',
          origem: 'whatsapp',
          status: 'contatado',
          observacoes: 'Quer alugar para aniversário'
        },
        {
          id: '950e8400-e29b-41d4-a716-446655440003',
          nome: 'Marcos Santos',
          email: 'marcos.santos@email.com',
          telefone: '(62) 99999-0000',
          interesse: 'Aula de Vôlei',
          origem: 'site',
          status: 'qualificado',
          observacoes: 'Jogador experiente, quer melhorar técnica'
        },
        {
          id: '950e8400-e29b-41d4-a716-446655440004',
          nome: 'Juliana Costa',
          email: 'juliana.costa@email.com',
          telefone: '(62) 99999-1111',
          interesse: 'Futevôlei',
          origem: 'indicacao',
          status: 'proposta',
          observacoes: 'Indicada por cliente atual'
        },
        {
          id: '950e8400-e29b-41d4-a716-446655440005',
          nome: 'Thiago Oliveira',
          email: 'thiago.oliveira@email.com',
          telefone: '(62) 99999-2222',
          interesse: 'Evento corporativo',
          origem: 'google',
          status: 'convertido',
          observacoes: 'Empresa quer fazer evento de integração'
        }
      ])
      .select()

    if (leadsError) {
      throw new Error(`Erro ao inserir leads: ${leadsError.message}`)
    }

    console.log(`✅ ${leads?.length} leads inseridos`)

    // =============================================
    // VERIFICAR DADOS INSERIDOS
    // =============================================
    console.log('🔍 Verificando dados inseridos...')
    
    const [quadrasCount, clientesCount, professoresCount, reservasCount, leadsCount] = await Promise.all([
      supabase.from('quadras').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'cliente'),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'professor'),
      supabase.from('reservas').select('id', { count: 'exact' }),
      supabase.from('leads').select('id', { count: 'exact' })
    ])

    const stats = {
      quadras: quadrasCount.count || 0,
      clientes: clientesCount.count || 0,
      professores: professoresCount.count || 0,
      reservas: reservasCount.count || 0,
      leads: leadsCount.count || 0
    }

    console.log('📊 Estatísticas finais:', stats)

    return NextResponse.json({
      ok: true,
      message: 'Dados de teste inseridos com sucesso!',
      data: {
        quadras: quadras?.length || 0,
        profiles: profiles?.length || 0,
        reservas: reservas?.length || 0,
        leads: leads?.length || 0,
        stats
      }
    })

  } catch (error: any) {
    console.error('❌ Erro ao popular dados de teste:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro ao popular dados de teste'
    }, { status: 500 })
  }
}

// GET - Verificar dados existentes
export async function GET() {
  try {
    const supabase = await getServerClient()
    
    const [quadrasCount, clientesCount, professoresCount, reservasCount, leadsCount] = await Promise.all([
      supabase.from('quadras').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'cliente'),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'professor'),
      supabase.from('reservas').select('id', { count: 'exact' }),
      supabase.from('leads').select('id', { count: 'exact' })
    ])

    const stats = {
      quadras: quadrasCount.count || 0,
      clientes: clientesCount.count || 0,
      professores: professoresCount.count || 0,
      reservas: reservasCount.count || 0,
      leads: leadsCount.count || 0
    }

    return NextResponse.json({
      ok: true,
      data: stats,
      message: 'Dados verificados com sucesso'
    })

  } catch (error: any) {
    console.error('❌ Erro ao verificar dados:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro ao verificar dados'
    }, { status: 500 })
  }
}
