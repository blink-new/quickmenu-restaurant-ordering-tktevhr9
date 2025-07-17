import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { QrCode, Download, Share2, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface QRCodeGeneratorProps {
  restaurantSlug: string
  restaurantName: string
}

export default function QRCodeGenerator({ restaurantSlug, restaurantName }: QRCodeGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const orderingUrl = `${window.location.origin}/r/${restaurantSlug}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(orderingUrl)}`

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(orderingUrl)
      toast.success('URL copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy URL:', error)
      toast.error('Failed to copy URL')
    }
  }

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `${restaurantSlug}-qr-code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('QR code downloaded!')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order from ${restaurantName}`,
          text: `Scan this QR code or visit the link to order from ${restaurantName}`,
          url: orderingUrl
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      handleCopyUrl()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="h-4 w-4 mr-2" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restaurant QR Code</DialogTitle>
          <DialogDescription>
            Customers can scan this QR code to access your ordering page
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <Card className="w-fit">
              <CardContent className="p-6">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code"
                  className="w-64 h-64 mx-auto"
                />
              </CardContent>
            </Card>
          </div>

          {/* Restaurant Info */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">{restaurantName}</h3>
            <p className="text-sm text-muted-foreground">
              Scan to order online
            </p>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs font-mono break-all">{orderingUrl}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadQR}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyUrl}>
              <Copy className="h-4 w-4 mr-1" />
              Copy URL
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">How to use:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Print this QR code and place it on tables</li>
              <li>• Add it to your menu or promotional materials</li>
              <li>• Share the URL on social media</li>
              <li>• Customers scan to access your ordering page</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}