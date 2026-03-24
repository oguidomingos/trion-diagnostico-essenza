import { useState, useEffect, useRef } from 'react'
import './index.css'

// ============ DATA ============
const CLINIC = {
  name: 'Essenza Estética Avançada',
  handle: '@essenzacba',
  location: 'Cuiabá - MT',
  address: 'Edifício Cuiabá Work Center, Av. Historiador Rubens de Mendonça, 1836, Sala 1308',
  whatsapp: '65 8136-7172',
  cnpj: '58.155.200/0001-01',
  website: 'essenzacuiaba.com.br',
  category: 'Health/Beauty',
}

const SCORES = {
  googleMaps: 30,
  instagram: 64,
  site: 15,
  overall: 36,
}

const INSTAGRAM = {
  followers: 826,
  following: 136,
  posts: 103,
  highlights: 4,
  engagementRate: 1.97,
  avgLikes: 14.7,
  avgComments: 1.5,
  hasReels: true,
  isBusinessAccount: true,
  isVerified: false,
  externalUrl: null,
  bio: '💎 Procedimentos com Produtos Exclusivos\n✨ Requinte em cada detalhe\n🤝 Atendimento Personalizado e Humanizado\n📍Cuiabá - MT\n📲 Agende sua avaliação 👇',
}

const GMB = {
  verified: 'Não confirmado',
  reviews: '9',
  rating: '4.6⭐',
  photos: '0 fotos (vídeos apenas)',
  videos: 'Antes/depois + espaço',
  posts: 'Inativos',
  mapPackPosition: 'Fora do Top 10',
  description: 'Não otimizada',
  categories: 'Incompletas',
  responseRate: 'Baixa',
}

const SITE = {
  status: 'FORA DO AR',
  ssl: false,
  mobile: 'N/A',
  speed: 'N/A',
  seo: 'Inexistente',
  blog: false,
  agendamento: false,
  analytics: false,
}

const COMPETITORS = [
  { name: 'Clínica Revie', followers: '5.2K+', reviews: '200+', rating: '4.8', site: 'Ativo' },
  { name: 'Cliniprev Estética', followers: '3.8K+', reviews: '150+', rating: '4.7', site: 'Ativo' },
  { name: 'Vanity Saúde', followers: '2.1K+', reviews: '80+', rating: '4.6', site: 'Ativo' },
]

// ============ COMPONENTS ============

function Stars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.7 + 0.3,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map(s => (
        <div key={s.id} className="absolute rounded-full bg-white" style={{
          left: `${s.left}%`, top: `${s.top}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          opacity: 0,
          '--max-opacity': s.opacity,
        }} />
      ))}
      <style>{`@keyframes twinkle { 0%,100%{opacity:0} 50%{opacity:var(--max-opacity)} }`}</style>
    </div>
  )
}

function ScoreRing({ score, size = 160, strokeWidth = 8, label }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(123,44,191,0.15)" strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="score-ring transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>
      {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
    </div>
  )
}

function StatusBadge({ status }) {
  const colors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    good: 'bg-green-500/20 text-green-400 border-green-500/30',
  }
  const labels = { critical: 'CRÍTICO', warning: 'ATENÇÃO', good: 'OK' }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[status]}`}>
      {labels[status]}
    </span>
  )
}

function CheckItem({ ok, label, detail }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {ok ? '✓' : '✗'}
      </div>
      <div>
        <span className="text-gray-200 text-sm">{label}</span>
        {detail && <span className="text-gray-500 text-xs ml-2">{detail}</span>}
      </div>
    </div>
  )
}

function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`relative py-16 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">{children}</div>
    </section>
  )
}

function SectionTitle({ number, title, subtitle }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-stellar/20 border border-stellar/30 flex items-center justify-center text-stellar-light font-bold text-sm">
          {number}
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-stellar/40 to-transparent" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
      {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
    </div>
  )
}

function MetricCard({ label, value, benchmark, status }) {
  const colors = { critical: 'border-red-500/30', warning: 'border-yellow-500/30', good: 'border-green-500/30' }
  return (
    <div className={`glass rounded-xl p-5 border ${colors[status] || 'border-stellar/20'}`}>
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {benchmark && <div className="text-xs text-gray-500 mt-1">Benchmark: {benchmark}</div>}
    </div>
  )
}

// ============ MAIN APP ============
export default function App() {
  const revenueMonthly = 8500
  const revenueAnnual = revenueMonthly * 12

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Stars />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stellar/10 via-transparent to-midnight" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-stellar/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-stellar/10 blur-2xl animate-pulse" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-stellar-light animate-pulse" />
            <span className="text-sm text-gray-400">Relatório Confidencial — Uso Exclusivo</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Relatório de<br />
            <span className="gradient-text">Posicionamento Digital</span>
          </h1>

          <div className="glass rounded-2xl px-8 py-6 inline-block mt-8 mb-8">
            <p className="text-xl text-white font-semibold">{CLINIC.name}</p>
            <p className="text-gray-400">{CLINIC.handle} — {CLINIC.location}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <ScoreRing score={SCORES.overall} size={200} strokeWidth={10} label="NOTA GERAL" />
          </div>

          <div className="mt-8 glass rounded-xl p-4 inline-block">
            <p className="text-red-400 font-bold text-lg">POSICIONAMENTO CRÍTICO</p>
            <p className="text-gray-400 text-sm">Receita estimada perdida: <span className="text-red-400 font-bold">R$ {revenueMonthly.toLocaleString('pt-BR')}/mês</span></p>
          </div>

          <div className="mt-12">
            <a href="#resumo" className="inline-flex items-center gap-2 bg-stellar hover:bg-stellar-dark text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105">
              Ver Diagnóstico Completo ↓
            </a>
          </div>
        </div>
      </section>

      {/* ===== RESUMO ===== */}
      <Section id="resumo">
        <SectionTitle number="01" title="Resumo Executivo" subtitle="Visão geral das 3 plataformas analisadas" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Google Maps', score: SCORES.googleMaps, icon: '📍' },
            { label: 'Instagram', score: SCORES.instagram, icon: '📸' },
            { label: 'Site', score: SCORES.site, icon: '🌐' },
          ].map(p => (
            <div key={p.label} className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">{p.icon}</div>
              <ScoreRing score={p.score} size={140} label={p.label} />
              <div className="mt-4">
                <StatusBadge status={p.score >= 80 ? 'good' : p.score >= 50 ? 'warning' : 'critical'} />
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 border border-red-500/20">
          <h3 className="text-xl font-bold text-white mb-6">3 Problemas Mais Urgentes</h3>
          <div className="space-y-4">
            {[
              { icon: '🔴', title: 'Site completamente fora do ar', impact: 'DNS não resolve — zero captação via busca orgânica', loss: 'R$ 4.000/mês' },
              { icon: '🔴', title: 'Google Maps com presença mínima', impact: '9 avaliações (concorrentes têm 150-200+), zero fotos, perfil incompleto', loss: 'R$ 3.000/mês' },
              { icon: '🟡', title: 'Instagram com fundamentos mas sem ecossistema', impact: 'Reels ativos e CTAs presentes, mas direciona só p/ WhatsApp — sem Linktree, sem site, sem identidade visual profissional', loss: 'R$ 1.500/mês' },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-midnight/60">
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1">
                  <p className="text-white font-semibold">{p.title}</p>
                  <p className="text-gray-400 text-sm">{p.impact}</p>
                </div>
                <div className="text-red-400 font-bold text-sm whitespace-nowrap">-{p.loss}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-red-400 font-bold text-2xl">Receita mensal perdida estimada: R$ {revenueMonthly.toLocaleString('pt-BR')}</p>
            <p className="text-gray-400 text-sm mt-1">R$ {revenueAnnual.toLocaleString('pt-BR')}/ano que estão indo para seus concorrentes</p>
          </div>
        </div>
      </Section>

      {/* ===== GOOGLE MAPS ===== */}
      <Section id="gmb" className="border-t border-stellar/10">
        <SectionTitle number="02" title="Google Maps / GMB" subtitle="Sua presença no Google Maps determina quem te encontra primeiro" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Avaliações" value={GMB.reviews} benchmark="100+" status="critical" />
          <MetricCard label="Nota Média" value={GMB.rating} benchmark="4.7+" status="warning" />
          <MetricCard label="Fotos" value={GMB.photos} benchmark="15+ fotos" status="critical" />
          <MetricCard label="Map Pack" value={GMB.mapPackPosition} benchmark="Top 3" status="critical" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Checklist do Perfil</h3>
            <CheckItem ok={false} label="Perfil verificado" detail="Sem verificação confirmada" />
            <CheckItem ok={false} label="Descrição otimizada (750 chars)" detail="Não otimizada com palavras-chave" />
            <CheckItem ok={false} label="Categorias secundárias" detail="Incompletas" />
            <CheckItem ok={false} label="Lista de serviços" detail="Não cadastrada" />
            <CheckItem ok={false} label="Fotos profissionais (mín. 15)" detail="0 fotos — apenas vídeos" />
            <CheckItem ok={true} label="Vídeos antes/depois + espaço" detail="Presentes" />
            <CheckItem ok={false} label="Google Posts semanais" detail="Inativos" />
            <CheckItem ok={false} label="Horários especiais (feriados)" detail="Não configurados" />
            <CheckItem ok={true} label="WhatsApp no perfil" />
            <CheckItem ok={true} label="Endereço cadastrado" />
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Comparativo — Concorrentes no Google Maps</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-stellar/10">
                    <th className="text-left py-2">Clínica</th>
                    <th className="text-center py-2">Avaliações</th>
                    <th className="text-center py-2">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-red-400 border-b border-stellar/5">
                    <td className="py-3 font-bold">Essenza (você)</td>
                    <td className="text-center">9</td>
                    <td className="text-center">4.6⭐</td>
                  </tr>
                  {COMPETITORS.map(c => (
                    <tr key={c.name} className="text-green-400 border-b border-stellar/5">
                      <td className="py-3">{c.name}</td>
                      <td className="text-center">{c.reviews}</td>
                      <td className="text-center">{c.rating}⭐</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm font-medium">
                Seus concorrentes têm até 22x mais avaliações. Com apenas 9 reviews, pacientes tendem a escolher clínicas com mais provas sociais.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 glass rounded-2xl p-6 text-center">
          <ScoreRing score={SCORES.googleMaps} size={120} label="Nota Google Maps" />
          <p className="text-gray-400 text-sm mt-4 max-w-xl mx-auto">
            Com 9 avaliações e nota 4.6, você tem uma base mas está muito atrás dos concorrentes (150-200+ reviews).
            O perfil tem vídeos (positivo), mas zero fotos — o Google prioriza perfis com conteúdo visual completo.
            Sem fotos profissionais e Google Posts ativos, você perde posição no Map Pack.
          </p>
        </div>
      </Section>

      {/* ===== INSTAGRAM ===== */}
      <Section id="instagram" className="border-t border-stellar/10">
        <SectionTitle number="03" title="Instagram" subtitle="Análise completa do perfil @essenzacba" />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <MetricCard label="Seguidores" value={INSTAGRAM.followers.toLocaleString('pt-BR')} benchmark="2.000+" status="warning" />
          <MetricCard label="Posts" value={INSTAGRAM.posts} benchmark="200+" status="warning" />
          <MetricCard label="Engajamento" value={`${INSTAGRAM.engagementRate}%`} benchmark="1.5-3%" status="warning" />
          <MetricCard label="Média Curtidas" value={INSTAGRAM.avgLikes} benchmark="40+" status="critical" />
          <MetricCard label="Destaques" value={INSTAGRAM.highlights} benchmark="6+" status="warning" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Perfil e Bio</h3>
            <CheckItem ok={true} label="Conta profissional/business" />
            <CheckItem ok={true} label="Bio com proposta de valor" />
            <CheckItem ok={true} label="Link WhatsApp na bio" />
            <CheckItem ok={true} label="Localização no perfil" />
            <CheckItem ok={false} label="Linktree com site + redes" detail="Apenas link direto WhatsApp — sem reforço de autoridade" />
            <CheckItem ok={false} label="Nome com palavra-chave local" detail="Falta 'Cuiabá' no nome" />
            <CheckItem ok={false} label="Destaques completos (6+)" detail="Apenas 4 destaques" />
            <CheckItem ok={false} label="URL do site no perfil" detail="Sem external URL" />
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Conteúdo e Estratégia</h3>
            <CheckItem ok={false} label="Frequência consistente (12+/mês)" detail="Irregular" />
            <CheckItem ok={true} label="Reels regulares (8+/mês)" detail="Produção ativa" />
            <CheckItem ok={false} label="Mix de conteúdo equilibrado" detail="Muito promocional" />
            <CheckItem ok={true} label="CTA nas legendas" detail="Presentes nos posts" />
            <CheckItem ok={true} label="Hashtags estratégicas e estruturadas" detail="Uso consistente" />
            <CheckItem ok={false} label="Identidade visual profissional" detail="Sem padrão visual" />
            <CheckItem ok={true} label="Sorteios para engajamento" detail="Giveaway ativo" />
            <CheckItem ok={true} label="Prova social (depoimentos)" detail="Alguns posts" />
          </div>
        </div>

        <div className="mt-8 glass rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Comparativo com Concorrentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-stellar/10">
                  <th className="text-left py-2">Perfil</th>
                  <th className="text-center py-2">Seguidores</th>
                  <th className="text-center py-2">Site</th>
                  <th className="text-center py-2">Google Maps</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-red-400 border-b border-stellar/5">
                  <td className="py-3 font-bold">@essenzacba (você)</td>
                  <td className="text-center">826</td>
                  <td className="text-center">Fora do ar</td>
                  <td className="text-center">9 avaliações</td>
                </tr>
                {COMPETITORS.map(c => (
                  <tr key={c.name} className="text-green-400 border-b border-stellar/5">
                    <td className="py-3">{c.name}</td>
                    <td className="text-center">{c.followers}</td>
                    <td className="text-center">{c.site}</td>
                    <td className="text-center">{c.reviews} avaliações</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 glass rounded-2xl p-6 text-center">
          <ScoreRing score={SCORES.instagram} size={120} label="Nota Instagram" />
          <p className="text-gray-400 text-sm mt-4 max-w-xl mx-auto">
            Com 826 seguidores, Reels ativos (8+/mês), CTAs e hashtags estruturadas, seu Instagram tem fundamentos sólidos.
            O gap principal é o direcionamento — só WhatsApp, sem Linktree com site e portfólio para reforço de autoridade.
            Com identidade visual profissional e um ecossistema completo (site + Linktree), o perfil pode escalar rápido.
          </p>
        </div>
      </Section>

      {/* ===== SITE ===== */}
      <Section id="site" className="border-t border-stellar/10">
        <SectionTitle number="04" title="Site / Landing Page" subtitle="Sua vitrine digital — onde a conversão acontece" />

        <div className="glass rounded-2xl p-8 border border-red-500/30 text-center mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-3xl font-bold text-red-400 mb-2">SITE FORA DO AR</h3>
          <p className="text-gray-400 max-w-lg mx-auto">
            O domínio <span className="text-white font-mono">{CLINIC.website}</span> não resolve (DNS failure).
            Seu site está completamente inacessível. Nenhum paciente que buscar por você no Google encontrará seu site.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Status" value="OFFLINE" status="critical" />
            <MetricCard label="SSL (HTTPS)" value="Inexistente" status="critical" />
            <MetricCard label="SEO" value="Zero" status="critical" />
            <MetricCard label="Conversão" value="0%" status="critical" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">O que um site profissional precisa ter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <CheckItem ok={false} label="Site acessível e online" detail="FORA DO AR" />
            <CheckItem ok={false} label="Certificado SSL (HTTPS)" />
            <CheckItem ok={false} label="Velocidade < 3 segundos" />
            <CheckItem ok={false} label="Design responsivo (mobile)" />
            <CheckItem ok={false} label="Página de cada serviço" />
            <CheckItem ok={false} label="Galeria antes/depois" />
            <CheckItem ok={false} label="Depoimentos de clientes" />
            <CheckItem ok={false} label="Blog com conteúdo educativo" />
            <CheckItem ok={false} label="Agendamento online" />
            <CheckItem ok={false} label="Botão WhatsApp flutuante" />
            <CheckItem ok={false} label="Google Analytics" />
            <CheckItem ok={false} label="Pixel Meta Ads" />
            <CheckItem ok={false} label="Schema LocalBusiness" />
            <CheckItem ok={false} label="FAQ estruturado" />
          </div>
        </div>

        <div className="mt-8 glass rounded-2xl p-6 text-center">
          <ScoreRing score={SCORES.site} size={120} label="Nota Site" />
          <p className="text-gray-400 text-sm mt-4 max-w-xl mx-auto">
            Sem site, você não existe para o Google. Não captura leads orgânicos, não tem SEO,
            não aparece em buscas por serviços na região. Cada dia sem site é um dia inteiro de
            pacientes que vão direto para a concorrência.
          </p>
        </div>
      </Section>

      {/* ===== IMPACTO FINANCEIRO ===== */}
      <Section id="impacto" className="border-t border-stellar/10">
        <SectionTitle number="05" title="Impacto Financeiro" subtitle="O custo real de não investir no digital" />

        <div className="glass rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Estimativa de Oportunidade Perdida</h3>
              <div className="space-y-3">
                {[
                  { label: 'Buscas mensais pelos seus serviços em Cuiabá', value: '2.400+' },
                  { label: 'Cliques que vão para concorrentes', value: '95%+' },
                  { label: 'Taxa de conversão média do setor', value: '3-7%' },
                  { label: 'Ticket médio por paciente (estética)', value: 'R$ 800-2.000' },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-stellar/10">
                    <span className="text-gray-400 text-sm">{r.label}</span>
                    <span className="text-white font-bold">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-center p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-gray-400 mb-2">Receita mensal perdida estimada</p>
                <p className="text-5xl font-bold text-red-400">R$ {revenueMonthly.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-gray-500 mt-2">R$ {revenueAnnual.toLocaleString('pt-BR')} por ano</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Se você capturasse apenas 20% do que está perdendo...</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { period: 'Por Mês', value: `R$ ${(revenueMonthly * 0.2).toLocaleString('pt-BR')}`, color: 'text-green-400' },
              { period: 'Por Trimestre', value: `R$ ${(revenueMonthly * 0.2 * 3).toLocaleString('pt-BR')}`, color: 'text-green-400' },
              { period: 'Por Ano', value: `R$ ${(revenueAnnual * 0.2).toLocaleString('pt-BR')}`, color: 'text-green-400' },
            ].map((p, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-gray-400 mb-1">{p.period}</p>
                <p className={`text-3xl font-bold ${p.color}`}>+{p.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== PLANO DE ACAO ===== */}
      <Section id="plano" className="border-t border-stellar/10">
        <SectionTitle number="06" title="Plano de Ação" subtitle="Roadmap priorizado para sair do vermelho" />

        <div className="space-y-6">
          {/* Fase 1 */}
          <div className="glass rounded-2xl p-6 border border-red-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">URGENTE</div>
              <span className="text-white font-bold">Semanas 1-2 — Fundação</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Colocar site no ar', desc: 'Landing page profissional com agendamento, WhatsApp, SEO básico' },
                { title: 'Configurar Google Meu Negócio', desc: 'Descrição otimizada, fotos, categorias, horários, link agendamento' },
                { title: 'Campanha de avaliações', desc: 'Pedir avaliações para pacientes atuais — meta: 30 em 30 dias' },
                { title: 'Instalar tracking', desc: 'Google Analytics, Pixel Meta, Google Tag Manager' },
              ].map((a, i) => (
                <div key={i} className="p-4 rounded-xl bg-midnight/60">
                  <p className="text-white font-semibold text-sm">{a.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fase 2 */}
          <div className="glass rounded-2xl p-6 border border-yellow-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">IMPORTANTE</div>
              <span className="text-white font-bold">Semanas 3-6 — Crescimento</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Estratégia de conteúdo Instagram', desc: 'Calendário editorial, identidade visual, mix de conteúdo, Reels' },
                { title: 'SEO local', desc: 'Páginas de serviço otimizadas, blog, schema markup' },
                { title: 'Google Ads local', desc: 'Campanhas para buscas de alta intenção na região' },
                { title: 'Automação de agendamento', desc: 'Sistema integrado site + WhatsApp + Google Calendar' },
              ].map((a, i) => (
                <div key={i} className="p-4 rounded-xl bg-midnight/60">
                  <p className="text-white font-semibold text-sm">{a.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fase 3 */}
          <div className="glass rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">ESCALA</div>
              <span className="text-white font-bold">Meses 2-3 — Dominação</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Meta Ads (Instagram + Facebook)', desc: 'Campanhas de conversão com público lookalike e retargeting' },
                { title: 'Conteúdo avançado', desc: 'Vídeos de procedimentos, depoimentos em vídeo, bastidores' },
                { title: 'Parcerias locais', desc: 'Influenciadoras de Cuiabá, colabs com profissionais' },
                { title: 'Dashboard de resultados', desc: 'ROI mensal medido, custo por lead, taxa de conversão' },
              ].map((a, i) => (
                <div key={i} className="p-4 rounded-xl bg-midnight/60">
                  <p className="text-white font-semibold text-sm">{a.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ===== CTA ===== */}
      <Section id="cta" className="border-t border-stellar/10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pare de Perder<br />
            <span className="gradient-text">R$ {revenueMonthly.toLocaleString('pt-BR')}/mês</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Enquanto você lê isso, pacientes em Cuiabá estão pesquisando por estética avançada —
            e encontrando seus concorrentes. A Trion Marketing é especializada em transformar
            clínicas invisíveis em referências digitais, com resultados medidos em ROI real.
          </p>

          <div className="glass rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                { metric: 'CPC Médio', value: 'R$ 12', desc: 'custo por clique' },
                { metric: 'Conversão', value: '7,4%', desc: 'visitante → lead' },
                { metric: 'ROI', value: '7,2x', desc: 'retorno sobre investimento' },
              ].map((m, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold text-stellar-light">{m.value}</p>
                  <p className="text-sm text-gray-400">{m.metric}</p>
                  <p className="text-xs text-gray-600">{m.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs">Resultados reais de clínicas parceiras da Trion Marketing</p>
          </div>

          <a href="https://wa.me/5561999999999?text=Olá! Vi o relatório de posicionamento digital da minha clínica e gostaria de agendar uma conversa estratégica."
            target="_blank" rel="noopener"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-stellar to-stellar-dark hover:from-stellar-dark hover:to-stellar text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 animate-pulse-glow">
            📱 Agendar Conversa Estratégica Gratuita
          </a>
          <p className="text-gray-600 text-xs mt-4">30 minutos — sem compromisso — 100% personalizado</p>
        </div>
      </Section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-stellar/10 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-stellar" />
            <span className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>TRION</span>
            <span className="text-lg text-stellar-light" style={{ fontFamily: 'Space Grotesk' }}>MARKETING</span>
          </div>
          <p className="text-gray-600 text-sm">
            Relatório preparado com dados públicos em {new Date().toLocaleDateString('pt-BR')}
          </p>
          <p className="text-gray-700 text-xs mt-2">
            Os números são estimativas baseadas em benchmarks do setor de estética e saúde. Resultados reais podem variar.
          </p>
        </div>
      </footer>
    </div>
  )
}
