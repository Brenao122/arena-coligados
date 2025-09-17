# 🎨 GUIA COMPLETO DE LAYOUT - ARENA COLIGADOS

## 📋 VISÃO GERAL DO DESIGN

### 🎯 **Identidade Visual**
- **Nome**: Arena Coligados
- **Slogan**: "Excelência Esportiva" / "Onde Campeões Nascem"
- **Paleta de Cores**: Laranja (#f97316) + Verde (#22c55e) + Preto/Cinza
- **Estilo**: Moderno, Premium, Esportivo com Glass Morphism

---

## 🎨 **PALETA DE CORES PRINCIPAL**

### Cores Primárias
```css
/* Laranja Principal */
--orange-500: #f97316
--orange-600: #ea580c
--orange-400: #fb923c
--orange-300: #fdba74

/* Verde Secundário */
--green-500: #22c55e
--green-600: #16a34a
--green-400: #4ade80

/* Neutros */
--gray-900: #111827 (Fundo principal)
--gray-800: #1f2937 (Cards)
--gray-700: #374151 (Bordas)
--gray-600: #4b5563
--gray-500: #6b7280
--gray-400: #9ca3af
--gray-300: #d1d5db
--gray-200: #e5e7eb
--white: #ffffff
```

### Gradientes
```css
/* Gradiente Principal */
background: linear-gradient(135deg, #f97316 0%, #22c55e 100%);

/* Gradiente Texto */
background: linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #f97316 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* Gradiente Hero */
background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 25%, rgba(249, 115, 22, 0.1) 50%, rgba(34, 197, 94, 0.1) 75%, rgba(15, 23, 42, 0.95) 100%);
```

---

## 🖼️ **IMAGENS E ASSETS**

### Logo Principal
```
URL: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-11%20at%2022.27.16-0QPOwwmNw3jfubVRs8DJkiW87DX0AW.jpeg
Dimensões: 56x56px (header), 80x80px (footer)
Estilo: Circular com borda laranja
```

### Imagens de Fundo
```
Hero Background: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2016%20de%20ago.%20de%202025%2C%2020_07_02-vHRYPnHSHDaG7PzpZsDBR8FIIcu3it.png

Login Background: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2015%20de%20ago.%20de%202025%2C%2015_13_59-EkQPctn7eQ0XFN7MokBqYnVMruGCyb.png

Unidade Matriz: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9c2a9c65-389e-4efe-ba04-1777a68cceda-CPVmvBi8nvJ9RvOay7Mn5t5CVTdraB.png

Unidade Vila Rosa: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/25ddf6be-a813-49c0-9376-be4fee818344-HhiSAmhJpJlEU4TfU88W2DnXZGQ6It.png

Aulas Experimentais: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/321b5503-4fbf-4643-a30f-5212578e5072-pyy8IRy2VJiTNsTbZJzKnkfv8V1fEt.png
```

### Imagens das Modalidades
```
Beach Tennis: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b8529c78-39c5-4aa4-bdac-94e318b5cf98-cgajBFxQprEq8DDQ2fAAZvwgptQxyM.png

Vôlei: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9263210e-51f6-4f5e-aa03-8acec0076252-dtDWKxHsAMXArMoEhIxPacbwmxssar.png

Futevôlei: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/946a596c-d20e-45cc-9950-9852afc1d697-e7q1ArrposcV5deu9cKjKZORZTDCPe.png
```

---

## 🏗️ **ESTRUTURA DE LAYOUT**

### 1. **PÁGINA INICIAL (Landing Page)**

#### Header
```jsx
<header className="bg-black/15 backdrop-blur-xl border-b border-orange-500/20 sticky top-0 z-50">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    {/* Logo + Nome */}
    <div className="flex items-center space-x-4">
      <Image src="logo-url" width={56} height={56} className="rounded-full ring-2 ring-orange-500/50" />
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
          Arena Coligados
        </h1>
        <p className="text-sm text-gray-300 font-medium">Excelência Esportiva</p>
      </div>
    </div>
    
    {/* Botão Login */}
    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105">
      Área do Cliente
    </Button>
  </div>
</header>
```

#### Hero Section
```jsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    <Image src="hero-bg-url" fill className="object-cover opacity-30" />
  </div>
  
  {/* Conteúdo Principal */}
  <div className="container mx-auto px-6 text-center relative z-10">
    <h1 className="text-7xl md:text-9xl font-black mb-12 leading-tight">
      <span className="bg-gradient-to-r from-orange-300 via-orange-200 to-white bg-clip-text text-transparent">
        ONDE{" "}
        <span className="champion-text text-8xl md:text-[10rem] leading-none">
          CAMPEÕES
        </span>
      </span>
      <br />
      <span className="text-white drop-shadow-2xl">NASCEM</span>
    </h1>
    
    <p className="text-2xl md:text-4xl text-gray-200 mb-16 leading-relaxed font-light max-w-5xl mx-auto drop-shadow-lg">
      Duas unidades premium em Goiânia com{" "}
      <span className="text-orange-300 font-bold">7 quadras profissionais</span> e tecnologia de ponta
    </p>
    
    {/* CTAs */}
    <div className="flex flex-wrap justify-center gap-8 mb-20">
      <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105">
        🔥 Reserve já sua quadra — últimas vagas promocionais!
      </Button>
      <Button variant="outline" className="text-2xl px-16 py-8 rounded-2xl border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm bg-white/5 shadow-2xl hover:shadow-white/10 transition-all duration-300 transform hover:scale-105">
        🎾 Experimente grátis sua 1ª aula — vagas limitadas por turma!
      </Button>
    </div>
  </div>
</section>
```

#### Stats Cards
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
  {stats.map((stat, index) => (
    <div key={index} className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden">
      <stat.icon className="h-16 w-16 text-orange-300 mx-auto mb-6 group-hover:scale-110 transition-transform drop-shadow-lg" />
      <div className="text-5xl font-black text-white mb-3 drop-shadow-lg">{stat.number}</div>
      <div className="text-gray-200 font-semibold text-lg">{stat.label}</div>
    </div>
  ))}
</div>
```

### 2. **PÁGINA DE LOGIN**

```jsx
<div className="min-h-screen flex items-center justify-center relative" style={{
  backgroundImage: `url('login-bg-url')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}}>
  <div className="absolute inset-0 bg-black/40"></div>
  
  <div className="max-w-md w-full space-y-8 p-8 relative z-10">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-2 relative">
        Arena Coligados
        <div className="absolute inset-0 text-orange-500 blur-sm -z-10">Arena Coligados</div>
      </h1>
      <p className="mt-2 text-gray-300 text-lg">Gestão Esportiva</p>
    </div>
    
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
      <LoginForm />
    </div>
  </div>
</div>
```

### 3. **DASHBOARD LAYOUT**

#### Sidebar
```jsx
<div className="flex grow flex-col gap-y-6 overflow-y-auto bg-gray-900 px-6 pb-4 border-r border-gray-700">
  {/* Logo */}
  <div className="flex h-20 shrink-0 items-center justify-between">
    <div className="flex items-center gap-3">
      <Image src="logo-url" width={48} height={48} className="rounded-full shadow-lg border-2 border-orange-500" />
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
          Arena Coligados
        </h1>
        <p className="text-xs text-gray-400 font-medium">Gestão Esportiva</p>
      </div>
    </div>
  </div>
  
  {/* Navigation */}
  <nav className="flex flex-1 flex-col">
    <ul className="flex flex-1 flex-col gap-y-2">
      {navigation.map((item) => (
        <li key={item.name}>
          <Link href={item.href} className={cn(
            pathname === item.href 
              ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg border border-orange-400/30"
              : "text-gray-300 hover:text-white hover:bg-gray-800 border border-transparent",
            "group flex gap-x-3 rounded-xl p-4 text-sm leading-6 font-medium transition-all duration-200 border"
          )}>
            <item.icon className="h-5 w-5 shrink-0" />
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
</div>
```

#### Header
```jsx
<header className="fixed top-0 left-16 lg:left-80 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
  <div className="flex items-center justify-between px-4 py-3">
    {/* Search */}
    <div className="flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Buscar reservas, clientes..." className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500" />
      </div>
    </div>
    
    {/* Right side */}
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
        <Bell className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
        <MessageSquare className="h-4 w-4" />
      </Button>
      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium">{profile?.full_name || 'Usuário'}</div>
              <div className="text-xs text-gray-400">{getRoleDisplayName(profile?.role || 'cliente')}</div>
            </div>
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  </div>
</header>
```

---

## 🎭 **ANIMAÇÕES E EFEITOS**

### CSS Animations
```css
/* Fade in suave */
@keyframes gentle-fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Glow sutil */
@keyframes very-subtle-glow {
  0%, 100% { text-shadow: 0 0 5px rgba(251, 146, 60, 0.2), 0 0 10px rgba(251, 146, 60, 0.1); }
  50% { text-shadow: 0 0 8px rgba(251, 146, 60, 0.3), 0 0 15px rgba(251, 146, 60, 0.2); }
}

/* Float animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Glow effect */
@keyframes glow {
  from { box-shadow: 0 0 20px rgba(249, 115, 22, 0.5); }
  to { box-shadow: 0 0 30px rgba(249, 115, 22, 0.8), 0 0 40px rgba(34, 197, 94, 0.3); }
}

/* Slide up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Classes de Animação
```css
.champion-text {
  animation: gentle-fade-in 1.5s ease-out, very-subtle-glow 5s ease-in-out infinite 1.5s;
  background: linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #f97316 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-glow { animation: glow 2s ease-in-out infinite alternate; }
.animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
```

---

## 🎨 **COMPONENTES REUTILIZÁVEIS**

### Botões
```css
.btn-primary {
  @apply bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl;
}

.btn-secondary {
  @apply bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl;
}

.btn-premium {
  @apply bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-2xl;
}
```

### Cards
```css
.card-arena {
  @apply bg-card border border-border rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105;
}

.card-premium {
  @apply bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:border-orange-500/50;
}
```

### Glass Morphism
```css
.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.dark .glass-effect {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 📱 **RESPONSIVIDADE**

### Breakpoints
```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Grid System
```jsx
/* Stats Grid */
<div className="grid grid-cols-2 md:grid-cols-4 gap-8">

/* Modalidades Grid */
<div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-10">

/* Unidades Grid */
<div className="grid lg:grid-cols-2 gap-16">
```

---

## 🎯 **ELEMENTOS ESPECÍFICOS**

### WhatsApp Float Button
```jsx
<a href="https://wa.me/556293550635" className="fixed bottom-8 right-8 z-50">
  <div className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-110 group">
    <MessageCircle className="h-10 w-10 group-hover:rotate-12 transition-transform" />
  </div>
</a>
```

### Background Effects
```jsx
{/* Premium grain texture */}
<div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_1.5px)] bg-[length:6px_6px]"></div>

{/* Subtle vignette */}
<div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_35%,transparent,rgba(0,0,0,0.25))]"></div>

{/* Radial gradients */}
<div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_80%_10%,rgba(255,138,0,0.15),transparent_60%),radial-gradient(90%_60%_at_10%_80%,rgba(255,106,0,0.12),transparent_70%),conic-gradient(from_210deg_at_40%_60%,rgba(255,138,0,0.18),rgba(255,106,0,0.10),rgba(255,138,0,0.18))]"></div>
```

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### ✅ **Cores e Gradientes**
- [ ] Implementar paleta de cores laranja/verde
- [ ] Aplicar gradientes nos textos principais
- [ ] Configurar glass morphism effects
- [ ] Implementar hover effects com scale

### ✅ **Imagens e Assets**
- [ ] Baixar todas as imagens de fundo
- [ ] Configurar logo circular com borda
- [ ] Implementar imagens das modalidades
- [ ] Configurar imagens das unidades

### ✅ **Layout e Estrutura**
- [ ] Implementar header com logo e CTA
- [ ] Criar hero section com título principal
- [ ] Configurar grid de estatísticas
- [ ] Implementar sidebar do dashboard
- [ ] Configurar header do dashboard

### ✅ **Animações**
- [ ] Implementar animações de fade-in
- [ ] Configurar glow effects
- [ ] Aplicar hover animations
- [ ] Implementar float animations

### ✅ **Responsividade**
- [ ] Configurar breakpoints
- [ ] Implementar grid responsivo
- [ ] Testar em diferentes dispositivos
- [ ] Ajustar tipografia para mobile

### ✅ **Componentes**
- [ ] Criar botões reutilizáveis
- [ ] Implementar cards premium
- [ ] Configurar formulários
- [ ] Implementar dropdowns

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Configurar ambiente** com as cores e fontes
2. **Implementar estrutura base** (header, hero, footer)
3. **Adicionar imagens** e assets visuais
4. **Configurar animações** e efeitos
5. **Testar responsividade** em diferentes dispositivos
6. **Ajustar detalhes** de UX/UI

---

**💡 Dica**: Use este guia como referência completa para replicar o design exato da Arena Coligados em qualquer plataforma!
