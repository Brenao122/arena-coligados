# 🎯 PROMPT DETALHADO PARA REPLICAR LAYOUT ARENA COLIGADOS

## 📋 INSTRUÇÕES COMPLETAS PARA A IA

### 🎨 **VISÃO GERAL DO PROJETO**
Você precisa replicar EXATAMENTE o layout da Arena Coligados, uma arena esportiva premium. O design deve ser:
- **Moderno e elegante** com efeitos visuais impressionantes
- **Premium e profissional** para transmitir qualidade
- **Esportivo e dinâmico** com animações suaves
- **Responsivo** funcionando perfeitamente em todos os dispositivos

---

## 🎨 **ESPECIFICAÇÕES DE DESIGN EXATAS**

### **PALETA DE CORES OBRIGATÓRIA**
```css
/* CORES PRINCIPAIS - USE EXATAMENTE ESTAS */
--orange-primary: #f97316    /* Laranja principal */
--orange-dark: #ea580c       /* Laranja escuro para hover */
--orange-light: #fb923c      /* Laranja claro para gradientes */
--orange-300: #fdba74        /* Laranja muito claro */

--green-primary: #22c55e     /* Verde principal */
--green-dark: #16a34a        /* Verde escuro para hover */
--green-light: #4ade80       /* Verde claro */

/* NEUTROS - FUNDO ESCURO PREMIUM */
--gray-900: #111827          /* Fundo principal */
--gray-800: #1f2937          /* Cards e elementos */
--gray-700: #374151          /* Bordas */
--gray-600: #4b5563          /* Texto secundário */
--gray-500: #6b7280          /* Texto muted */
--gray-400: #9ca3af          /* Placeholders */
--gray-300: #d1d5db          /* Texto claro */
--white: #ffffff             /* Texto principal */
```

### **GRADIENTES OBRIGATÓRIOS**
```css
/* GRADIENTE PRINCIPAL - USE EM TODOS OS BOTÕES PRINCIPAIS */
background: linear-gradient(135deg, #f97316 0%, #22c55e 100%);

/* GRADIENTE TEXTO PRINCIPAL - USE NO TÍTULO "CAMPEÕES" */
background: linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #f97316 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* GRADIENTE HERO BACKGROUND */
background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 25%, rgba(249, 115, 22, 0.1) 50%, rgba(34, 197, 94, 0.1) 75%, rgba(15, 23, 42, 0.95) 100%);
```

---

## 🖼️ **IMAGENS E ASSETS OBRIGATÓRIOS**

### **LOGO PRINCIPAL**
```
URL: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-11%20at%2022.27.16-0QPOwwmNw3jfubVRs8DJkiW87DX0AW.jpeg
ESTILO: Circular, borda laranja, sombra
TAMANHOS: 56x56px (header), 80x80px (footer)
```

### **IMAGENS DE FUNDO**
```
HERO BACKGROUND: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2016%20de%20ago.%20de%202025%2C%2020_07_02-vHRYPnHSHDaG7PzpZsDBR8FIIcu3it.png
LOGIN BACKGROUND: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2015%20de%20ago.%20de%202025%2C%2015_13_59-EkQPctn7eQ0XFN7MokBqYnVMruGCyb.png
```

### **IMAGENS DAS MODALIDADES**
```
BEACH TENNIS: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b8529c78-39c5-4aa4-bdac-94e318b5cf98-cgajBFxQprEq8DDQ2fAAZvwgptQxyM.png
VÔLEI: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9263210e-51f6-4f5e-aa03-8acec0076252-dtDWKxHsAMXArMoEhIxPacbwmxssar.png
FUTEVÔLEI: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/946a596c-d20e-45cc-9950-9852afc1d697-e7q1ArrposcV5deu9cKjKZORZTDCPe.png
```

---

## 🎭 **ANIMAÇÕES E EFEITOS OBRIGATÓRIOS**

### **ANIMAÇÕES CSS - IMPLEMENTE EXATAMENTE ASSIM**
```css
/* FADE IN SUAVE */
@keyframes gentle-fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* GLOW SUTIL NO TEXTO */
@keyframes very-subtle-glow {
  0%, 100% { 
    text-shadow: 0 0 5px rgba(251, 146, 60, 0.2), 0 0 10px rgba(251, 146, 60, 0.1); 
  }
  50% { 
    text-shadow: 0 0 8px rgba(251, 146, 60, 0.3), 0 0 15px rgba(251, 146, 60, 0.2); 
  }
}

/* FLOAT ANIMATION */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* GLOW EFFECT */
@keyframes glow {
  from { box-shadow: 0 0 20px rgba(249, 115, 22, 0.5); }
  to { box-shadow: 0 0 30px rgba(249, 115, 22, 0.8), 0 0 40px rgba(34, 197, 94, 0.3); }
}

/* SLIDE UP */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### **CLASSES DE ANIMAÇÃO - USE EXATAMENTE**
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

## 🎯 **ELEMENTOS ESPECÍFICOS OBRIGATÓRIOS**

### **1. TÍTULO PRINCIPAL "ONDE CAMPEÕES NASCEM"**
```html
<h1 class="text-7xl md:text-9xl font-black mb-12 leading-tight">
  <span class="bg-gradient-to-r from-orange-300 via-orange-200 to-white bg-clip-text text-transparent">
    ONDE 
    <span class="champion-text text-8xl md:text-[10rem] leading-none">
      CAMPEÕES
    </span>
  </span>
  <br>
  <span class="text-white drop-shadow-2xl">NASCEM</span>
</h1>
```

### **2. BOTÕES PRINCIPAIS - ESTILO EXATO**
```html
<!-- BOTÃO PRINCIPAL LARANJA -->
<button class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 group border-0">
  🔥 Reserve já sua quadra — últimas vagas promocionais!
</button>

<!-- BOTÃO SECUNDÁRIO TRANSPARENTE -->
<button class="text-2xl px-16 py-8 rounded-2xl border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm bg-white/5 shadow-2xl hover:shadow-white/10 transition-all duration-300 transform hover:scale-105">
  🎾 Experimente grátis sua 1ª aula — vagas limitadas por turma!
</button>
```

### **3. CARDS DE ESTATÍSTICAS - ESTILO EXATO**
```html
<div class="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden">
  <div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
    URGENTE
  </div>
  <div class="h-16 w-16 text-orange-300 mx-auto mb-6 group-hover:scale-110 transition-transform drop-shadow-lg">
    <!-- ÍCONE AQUI -->
  </div>
  <div class="text-5xl font-black text-white mb-3 drop-shadow-lg">7</div>
  <div class="text-gray-200 font-semibold text-lg">Quadras Profissionais</div>
</div>
```

---

## 📱 **BOTÃO WHATSAPP - IMPLEMENTAÇÃO EXATA**

### **BOTÃO FLUTUANTE WHATSAPP**
```html
<a href="https://wa.me/556293550635?text=Olá! Quero reservar minha quadra na Arena Coligados agora mesmo!" 
   target="_blank" 
   rel="noopener noreferrer" 
   class="fixed bottom-8 right-8 z-50">
  
  <div class="bg-green-500 hover:bg-green-600 text-white p-6 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-110 group">
    <svg class="h-10 w-10 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
  </div>
</a>
```

### **BOTÃO WHATSAPP NO FOOTER**
```html
<a href="https://wa.me/556293550635?text=Olá! Quero reservar minha quadra na Arena Coligados agora mesmo!" 
   target="_blank" 
   rel="noopener noreferrer">
  
  <button class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 group border-0">
    <svg class="h-8 w-8 mr-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
    📲 Reserve agora mesmo pelo WhatsApp em segundos
  </button>
</a>
```

---

## 🎨 **EFEITOS VISUAIS OBRIGATÓRIOS**

### **GLASS MORPHISM - USE EXATAMENTE**
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

### **BACKGROUND EFFECTS - IMPLEMENTE EXATAMENTE**
```html
<!-- PREMIUM GRAIN TEXTURE -->
<div class="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_1.5px)] bg-[length:6px_6px]"></div>

<!-- SUBTLE VIGNETTE -->
<div class="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_35%,transparent,rgba(0,0,0,0.25))]"></div>

<!-- RADIAL GRADIENTS -->
<div class="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_80%_10%,rgba(255,138,0,0.15),transparent_60%),radial-gradient(90%_60%_at_10%_80%,rgba(255,106,0,0.12),transparent_70%),conic-gradient(from_210deg_at_40%_60%,rgba(255,138,0,0.18),rgba(255,106,0,0.10),rgba(255,138,0,0.18))]"></div>
```

---

## 📱 **RESPONSIVIDADE OBRIGATÓRIA**

### **BREAKPOINTS - USE EXATAMENTE**
```css
/* MOBILE FIRST */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### **GRID SYSTEM - IMPLEMENTE EXATAMENTE**
```html
<!-- STATS GRID -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-8">

<!-- MODALIDADES GRID -->
<div class="grid lg:grid-cols-2 xl:grid-cols-4 gap-10">

<!-- UNIDADES GRID -->
<div class="grid lg:grid-cols-2 gap-16">
```

---

## 🎯 **INSTRUÇÕES ESPECÍFICAS PARA A IA**

### **1. FONTES E TIPOGRAFIA**
- Use **font-weight: 900** para títulos principais
- Use **font-weight: 700** para subtítulos
- Use **font-weight: 600** para textos importantes
- Use **font-weight: 400** para textos normais
- **NUNCA** use fontes serifadas - apenas sans-serif
- Use **letter-spacing: -0.01em** para títulos grandes

### **2. ESPAÇAMENTOS**
- Use **padding: 2rem** para seções principais
- Use **margin-bottom: 3rem** entre elementos grandes
- Use **gap: 1rem** em grids pequenos
- Use **gap: 2rem** em grids grandes

### **3. BORDAS E SOMBRAS**
- Use **border-radius: 1rem** para cards normais
- Use **border-radius: 1.5rem** para cards grandes
- Use **border-radius: 2rem** para botões principais
- Use **box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)** para sombras grandes

### **4. HOVER EFFECTS**
- **SEMPRE** use `transform: scale(1.05)` em hover
- **SEMPRE** use `transition: all 0.3s ease`
- **SEMPRE** use `box-shadow` mais intensa no hover
- **SEMPRE** use `opacity: 0.8` em elementos transparentes

### **5. CORES DE TEXTO**
- **Títulos principais**: `text-white`
- **Subtítulos**: `text-gray-200`
- **Texto normal**: `text-gray-300`
- **Texto secundário**: `text-gray-400`
- **Placeholders**: `text-gray-500`

---

## 🚨 **ERROS COMUNS A EVITAR**

### **❌ NÃO FAÇA:**
- Não use fontes serifadas
- Não use cores claras demais
- Não use animações muito rápidas
- Não use bordas muito grossas
- Não use sombras muito suaves
- Não use gradientes muito contrastantes

### **✅ SEMPRE FAÇA:**
- Use as cores exatas da paleta
- Use as animações suaves
- Use glass morphism effects
- Use hover effects com scale
- Use gradientes laranja-verde
- Use sombras dramáticas

---

## 🎯 **CHECKLIST FINAL**

### **✅ IMPLEMENTAÇÃO OBRIGATÓRIA:**
- [ ] Paleta de cores exata (laranja #f97316 + verde #22c55e)
- [ ] Gradientes implementados corretamente
- [ ] Animações suaves funcionando
- [ ] Glass morphism effects
- [ ] Botões WhatsApp funcionais
- [ ] Responsividade perfeita
- [ ] Hover effects com scale
- [ ] Sombras dramáticas
- [ ] Tipografia correta (sans-serif, weights corretos)
- [ ] Espaçamentos proporcionais

### **✅ TESTES OBRIGATÓRIOS:**
- [ ] Teste em mobile (320px)
- [ ] Teste em tablet (768px)
- [ ] Teste em desktop (1920px)
- [ ] Teste de hover effects
- [ ] Teste de animações
- [ ] Teste de botões WhatsApp
- [ ] Teste de gradientes
- [ ] Teste de glass morphism

---

## 🎯 **RESULTADO ESPERADO**

O layout final deve ser **IDENTICAL** ao original da Arena Coligados:
- ✅ Cores exatas
- ✅ Animações suaves
- ✅ Efeitos visuais impressionantes
- ✅ Responsividade perfeita
- ✅ Botões WhatsApp funcionais
- ✅ Glass morphism effects
- ✅ Gradientes laranja-verde
- ✅ Tipografia moderna
- ✅ Hover effects com scale
- ✅ Sombras dramáticas

**IMPORTANTE**: Se algo não estiver igual ao original, ajuste até ficar PERFEITO!
