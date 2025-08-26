
"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Product } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const productSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "O preço deve ser um número." }).min(0, "O preço deve ser positivo.")
  ),
  builder: z.string().optional(),
  size: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "O tamanho deve ser um número." }).min(0).optional()
  ),
  rooms: z.string().optional(),
  position: z.string().optional(),
  pricePerSqM: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "O valor deve ser um número." }).min(0).optional()
  ),
  location: z.string().optional(),
  deliveryDate: z.string().optional(),
  unit: z.string().optional(),
  floor: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product: Product | null;
  onSave: (productData: Product) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      builder: product?.builder || '',
      size: product?.size || undefined,
      rooms: product?.rooms || '',
      position: product?.position || '',
      pricePerSqM: product?.pricePerSqM || undefined,
      location: product?.location || '',
      deliveryDate: product?.deliveryDate || '',
      unit: product?.unit || '',
      floor: product?.floor || '',
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    onSave({ ...data, id: product?.id || '' });
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogDescription>
            {product ? 'Atualize as informações do produto.' : 'Preencha as informações do novo produto.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <ScrollArea className="h-[60vh] pr-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nome (Produto)</FormLabel>
                        <FormControl>
                            <Input placeholder="Nome do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="builder"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Construtora</FormLabel>
                        <FormControl>
                            <Input placeholder="Nome da construtora" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tamanho (m²)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Tamanho em metros quadrados" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="rooms"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Quartos (QTOS)</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: FLAT, 2 quartos" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Posição</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: SUL" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="pricePerSqM"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Valor do m²</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Local</FormLabel>
                        <FormControl>
                            <Input placeholder="Bairro ou região" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Entrega</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: dez./26" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Unidade</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: 1º andar" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Andar</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: 1º andar" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Descreva o produto" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <DialogFooter className="sticky bottom-0 bg-background py-4">
                        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </DialogFooter>
                </form>
            </ScrollArea>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
