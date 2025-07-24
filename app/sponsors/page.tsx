"use client"

const SPONSORS = [
  { name: 'GTARoleplay', url: 'https://gta-rp.com', desc: 'Serveur RP GTA 6', logo: '/placeholder-logo.png' },
  { name: 'ModdingPro', url: 'https://moddingpro.com', desc: 'Formation modding GTA', logo: '/placeholder-logo.svg' },
]

export default function SponsorsPage() {
  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center mb-4">Sponsors & Partenaires</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {SPONSORS.map(s => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener" className="flex items-center gap-4 bg-card/80 shadow-smooth rounded-xl p-6 hover:scale-[1.03] transition-transform">
            <img src={s.logo} alt={s.name} className="h-12 w-12 rounded-lg object-contain" />
            <div>
              <div className="font-bold text-lg mb-1">{s.name}</div>
              <div className="text-muted-foreground text-sm">{s.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
} 