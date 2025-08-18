
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Linkedin, Instagram, Facebook, Youtube, Globe, Phone, Mail, MapPin } from 'lucide-react';

const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/p%C3%A9-na-areia-imobili%C3%A1ria-0b918b34b/', icon: Linkedin },
    { name: 'Instagram', url: 'https://www.instagram.com/penaareiaimobiliaria/', icon: Instagram },
    { name: 'Facebook', url: 'https://www.facebook.com/penaareiaimob', icon: Facebook },
    { name: 'YouTube', url: 'https://www.youtube.com/@penaareianegociosimobiliarios', icon: Youtube },
];

const contactInfo = [
    { name: 'Website', value: 'imobiliariapenaareia.com', url: 'https://www.imobiliariapenaareia.com/', icon: Globe },
    { name: 'Telefone', value: '(83) 99905-7007', url: 'tel:+5583999057007', icon: Phone },
    { name: 'Email', value: 'penaareiaimobiliaria@gmail.com', url: 'mailto:penaareiaimobiliaria@gmail.com', icon: Mail },
    { name: 'Endereço', value: 'Rua Mirian Barreto Rabelo nº 135, sala 305, João Pessoa - PB', icon: MapPin },
];

export default function SupportPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Suporte e Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            
            <div>
                <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>
                <div className="space-y-4">
                    {contactInfo.map((item) => (
                        <div key={item.name} className="flex items-start gap-4">
                            <item.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                            <div>
                                <p className="font-medium">{item.name}</p>
                                {item.url ? (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        {item.value}
                                    </a>
                                ) : (
                                    <p className="text-muted-foreground">{item.value}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />
            
            <div>
                <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
                <div className="flex flex-wrap gap-4">
                    {socialLinks.map((social) => (
                        <a 
                            key={social.name} 
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <social.icon className="h-6 w-6" />
                            <span className="font-medium">{social.name}</span>
                        </a>
                    ))}
                </div>
            </div>
            
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
