import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import EMEventsClient from "./em-events-client"

export default function EMEventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <div className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Tools", href: "/tools" },
                { label: "EM Events", current: true }
              ]} 
            />
          </div>
        </div>
      </div>
      
      <EMEventsClient />
      <Footer />
    </div>
  )
}
