import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const sponsoredContent = [
  {
    id: 1,
    title: "Serveur GTA 6 RP Premium",
    description: "Rejoignez le meilleur serveur roleplay avec +1000 joueurs actifs",
    image: "/placeholder.svg?height=120&width=200",
    badge: "Sponsorisé",
    link: "/sponsor/gta6-rp-premium",
  },
  {
    id: 2,
    title: "Formation Modding GTA 6",
    description: "Apprenez à créer vos propres mods avec notre cours complet",
    image: "/placeholder.svg?height=120&width=200",
    badge: "Partenaire",
    link: "/sponsor/modding-course",
  },
]

const topContributors = [
  { name: "ModMaster", contributions: 45, avatar: "/placeholder-user.jpg" },
  { name: "GamerPro", contributions: 38, avatar: "/placeholder-user.jpg" },
  { name: "PhysicsGuru", contributions: 32, avatar: "/placeholder-user.jpg" },
  { name: "LoreExpert", contributions: 28, avatar: "/placeholder-user.jpg" },
]

export function SponsorSidebar() {
  return (
    <div className="space-y-6">
      {/* Sponsored Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contenu sponsorisé</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sponsoredContent.map((content) => (
            <div key={content.id} className="space-y-3">
              <div className="relative">
                <Image
                  src={content.image || "/placeholder.svg"}
                  alt={content.title}
                  width={200}
                  height={120}
                  className="w-full h-24 object-cover rounded-md"
                />
                <Badge className="absolute top-2 left-2 text-xs">{content.badge}</Badge>
              </div>
              <div>
                <h4 className="font-medium text-sm line-clamp-2">{content.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{content.description}</p>
                <Button asChild size="sm" className="w-full mt-2">
                  <Link href={content.link}>
                    En savoir plus
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Top contributeurs
          </CardTitle>
          <CardDescription>Cette semaine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topContributors.map((contributor, index) => (
              <div key={contributor.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{contributor.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {contributor.contributions}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Membres actifs</span>
            <span className="text-sm font-medium">12,847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Mods publiés</span>
            <span className="text-sm font-medium">1,234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Guides créés</span>
            <span className="text-sm font-medium">856</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Téléchargements</span>
            <span className="text-sm font-medium">2.1M</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
