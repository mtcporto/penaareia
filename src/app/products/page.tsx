
"use client"

import { useState, useMemo } from 'react';
import { mockProducts } from '@/data/mock-data';
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSave = (productData: Product) => {
    if (selectedProduct) {
      setProducts(products.map(p => p.id === productData.id ? productData : p));
    } else {
      setProducts([...products, { ...productData, id: `p${Date.now()}` }]);
    }
    setIsFormOpen(false);
    setSelectedProduct(null);
  };
  
  const handleDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <AppShell>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar produto..."
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

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map(product => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
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
            ))}
             {filteredProducts.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum produto encontrado.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </div>
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
        {isDeleteDialogOpen && (
            <DeleteConfirmationDialog
                title="Excluir Produto"
                description={`Tem certeza que deseja excluir o produto "${selectedProduct?.name}"? Esta ação não pode ser desfeita.`}
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
