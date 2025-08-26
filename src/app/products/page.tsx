
"use client"

import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { ProductForm } from './product-form';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { AppShell } from '@/components/app-shell';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, [])

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  const handleSave = async (productData: Product) => {
    try {
        if (selectedProduct && selectedProduct.id) {
            await updateProduct(selectedProduct.id, productData);
            toast({ title: "Sucesso", description: "Produto atualizado." });
        } else {
            await addProduct(productData);
            toast({ title: "Sucesso", description: "Produto criado." });
        }
        fetchProducts();
        setIsFormOpen(false);
        setSelectedProduct(null);
    } catch (error) {
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível salvar o produto." });
    }
  };
  
  const handleDelete = async () => {
    if (selectedProduct && selectedProduct.id) {
      try {
        await deleteProduct(selectedProduct.id);
        toast({ title: "Sucesso", description: "Produto excluído." });
        fetchProducts();
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
      } catch (error) {
         toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir o produto." });
      }
    }
  };

  const openForm = (product: Product | null = null) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };
  
  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  }

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.builder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <AppShell>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, construtora, local..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => openForm()}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Novo Produto
        </Button>
      </div>

      <ScrollArea className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Construtora</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Quartos</TableHead>
              <TableHead>Posição</TableHead>
              <TableHead>Valor (R$)</TableHead>
              <TableHead>Valor m²</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Andar</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={12} className="h-24 text-center">
                        Carregando...
                    </TableCell>
                </TableRow>
            ) : filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.builder}</TableCell>
                    <TableCell>{product.size ? `${product.size} m²` : '-'}</TableCell>
                    <TableCell>{product.rooms}</TableCell>
                    <TableCell>{product.position}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{formatCurrency(product.pricePerSqM)}</TableCell>
                    <TableCell>{product.location}</TableCell>
                    <TableCell>{product.deliveryDate}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>{product.floor}</TableCell>
                    <TableCell>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openForm(product)}>
                        <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => openDeleteDialog(product)}>
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={12} className="h-24 text-center">
                    Nenhum produto encontrado.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
        {isFormOpen && (
            <ProductForm
                product={selectedProduct}
                onSave={handleSave}
                onCancel={() => {
                    setIsFormOpen(false);
                    setSelectedProduct(null);
                }}
            />
        )}
        {isDeleteDialogOpen && selectedProduct && (
            <DeleteConfirmationDialog
                title="Excluir Produto"
                description={`Tem certeza que deseja excluir o produto "${selectedProduct.name}"? Esta ação não pode ser desfeita.`}
                onConfirm={handleDelete}
                onCancel={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedProduct(null);
                }}
            />
        )}
    </AppShell>
  );
}
