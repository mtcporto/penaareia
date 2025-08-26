
import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  getDoc,
  Timestamp,
  arrayUnion,
  setDoc,
} from 'firebase/firestore';
import type { Company, Contact, Deal, Product, Task, Note, Stage, Broker } from '@/types';
import { mockCompanies, mockContacts, mockDeals, mockTasks, mockNotes } from '@/data/mock-data';

// Generic CRUD Functions
const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const q = collection(db, collectionName);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T));
};

const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as T;
    }
    return null;
}

const addDocument = async <T extends { id?: string }>(collectionName: string, data: Omit<T, 'id'>): Promise<T> => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return { ...data, id: docRef.id } as T;
};

const setDocument = async <T extends { id: string }>(collectionName: string, data: T): Promise<void> => {
  const docRef = doc(db, collectionName, data.id);
  await setDoc(docRef, data);
};

const updateDocument = async <T extends { id?: string }>(collectionName: string, id: string, data: Partial<Omit<T, 'id'>>): Promise<void> => {
  await updateDoc(doc(db, collectionName, id), data);
};

const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  await deleteDoc(doc(db, collectionName, id));
};


// Companies
export const getCompanies = () => getCollection<Company>('companies');
export const getCompany = (id: string) => getDocument<Company>('companies', id);
export const addCompany = (data: Omit<Company, 'id'>) => addDocument<Company>('companies', data);
export const updateCompany = (id: string, data: Partial<Company>) => updateDocument<Company>('companies', id, data);
export const deleteCompany = (id: string) => deleteDocument('companies', id);

// Contacts
export const getContacts = () => getCollection<Contact>('contacts');
export const getContact = (id: string) => getDocument<Contact>('contacts', id);
export const getContactsByCompany = async (companyId: string): Promise<Contact[]> => {
    const q = query(collection(db, 'contacts'), where('companyId', '==', companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Contact));
}
export const addContact = (data: Omit<Contact, 'id'>) => addDocument<Contact>('contacts', data);
export const updateContact = (id: string, data: Partial<Contact>) => updateDocument<Contact>('contacts', id, data);
export const deleteContact = (id: string) => deleteDocument('contacts', id);

// Products
export const getProducts = () => getCollection<Product>('products');
export const getProduct = (id: string) => getDocument<Product>('products', id);
export const addProduct = (data: Omit<Product, 'id'>) => addDocument<Product>('products', data);
export const updateProduct = (id: string, data: Partial<Product>) => updateDocument<Product>('products', id, data);
export const deleteProduct = (id: string) => deleteDocument('products', id);

// Deals
export const getDeals = () => getCollection<Deal>('deals');
export const getDeal = (id: string) => getDocument<Deal>('deals', id);
export const addDeal = (data: Omit<Deal, 'id'>) => addDocument<Deal>('deals', { ...data, tasks: [], notes: [], contactHistory: []});
export const updateDeal = (id: string, data: Partial<Deal>) => updateDocument<Deal>('deals', id, data);
export const updateDealStage = async (id: string, stage: Stage) => {
    const dealRef = doc(db, 'deals', id);
    const newHistoryEntry = `Card movido para ${stage} em ${new Date().toLocaleDateString('pt-BR')}`;
    await updateDoc(dealRef, { 
        stage: stage,
        contactHistory: arrayUnion(newHistoryEntry)
    });
};
export const deleteDeal = (id: string) => deleteDocument('deals', id);


// Tasks (subcollection of deals)
export const getTasks = (dealId: string) => getCollection<Task>(`deals/${dealId}/tasks`);
export const addTask = (dealId: string, data: Omit<Task, 'id'>) => addDocument<Task>(`deals/${dealId}/tasks`, {...data, dueDate: data.dueDate ? Timestamp.fromDate(new Date(data.dueDate)) : undefined});
export const updateTask = (dealId: string, taskId: string, data: Partial<Task>) => updateDocument<Task>(`deals/${dealId}/tasks`, taskId, {...data, dueDate: data.dueDate ? Timestamp.fromDate(new Date(data.dueDate)) : undefined});
export const deleteTask = (dealId: string, taskId: string) => deleteDocument(`deals/${dealId}/tasks`, taskId);

// Notes (subcollection of deals)
export const getNotes = (dealId: string) => getCollection<Note>(`deals/${dealId}/notes`);
export const addNote = (dealId: string, data: Omit<Note, 'id'>) => addDocument<Note>(`deals/${dealId}/notes`, {...data, createdAt: Timestamp.fromDate(new Date())});
export const updateNote = (dealId: string, noteId: string, data: Partial<Note>) => updateDocument<Note>(`deals/${dealId}/notes`, noteId, data);
export const deleteNote = (dealId: string, noteId: string) => deleteDocument(`deals/${dealId}/notes`, noteId);

// Brokers / Users with Roles
export const getBrokers = () => getCollection<Broker>('brokers');
export const getBroker = (id: string) => getDocument<Broker>('brokers', id);
export const addBroker = (data: Broker) => setDocument<Broker>('brokers', data);
export const updateBroker = (id: string, data: Partial<Broker>) => updateDocument<Broker>('brokers', id, data);
export const deleteBroker = (id: string) => deleteDocument('brokers', id);

// Helper to clear a collection
const clearCollection = async (collectionName: string) => {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`${collectionName} collection cleared.`);
}

const parseCurrency = (currencyString: string | null): number | undefined => {
    if (!currencyString) return undefined;
    const numberString = currencyString.replace(/R\$\s?/, '').replace(/\./g, '').replace(/,/, '.');
    const value = parseFloat(numberString);
    return isNaN(value) ? undefined : value;
}

export const migrateProducts = async (newProductsData: any[]) => {
    console.log("Starting product migration...");
    try {
        await clearCollection('products');

        const batch = writeBatch(db);
        newProductsData.forEach(item => {
            if (item.Produto === 'TOTAL VGV') return;
            
            const newProduct: Partial<Omit<Product, 'id'>> = {
                name: item.Produto || 'N/A',
                price: parseCurrency(item['Valor (R$)']) || 0,
            };

            if (item.Construtora) newProduct.builder = item.Construtora;
            if (item.Tamanho) newProduct.size = item.Tamanho;
            if (item.QTOS) newProduct.rooms = item.QTOS;
            if (item.Posição) newProduct.position = item.Posição;
            
            const pricePerSqM = parseCurrency(item['mt²']);
            if (pricePerSqM !== undefined) newProduct.pricePerSqM = pricePerSqM;
            
            if (item.Local) newProduct.location = item.Local;
            if (item.Entrega) newProduct.deliveryDate = item.Entrega;
            if (item.Unidade) newProduct.unit = item.Unidade;
            if (item.Andar) newProduct.floor = item.Andar;

            const docRef = doc(collection(db, 'products'));
            batch.set(docRef, newProduct);
        });

        await batch.commit();
        console.log("Product migration completed successfully!");
        return { success: true, message: "Produtos migrados com sucesso!" };

    } catch (error: any) {
        console.error("Error migrating products:", error);
        return { success: false, message: `Erro ao migrar produtos: ${error.message}` };
    }
}


// --- Seeding ---
// Check if data exists
const isCollectionEmpty = async (collectionName: string) => {
    const q = query(collection(db, collectionName));
    const snapshot = await getDocs(q);
    return snapshot.empty;
};

// Seed all data
export const seedDatabase = async () => {
    const batch = writeBatch(db);

    if (await isCollectionEmpty('companies')) {
        console.log("Seeding companies...");
        mockCompanies.forEach(company => {
            const docRef = doc(db, 'companies', company.id);
            batch.set(docRef, company);
        });
    }

    if (await isCollectionEmpty('contacts')) {
        console.log("Seeding contacts...");
        mockContacts.forEach(contact => {
            const docRef = doc(db, 'contacts', contact.id);
            batch.set(docRef, contact);
        });
    }
    
    if (await isCollectionEmpty('deals')) {
        console.log("Seeding deals...");
        mockDeals.forEach(deal => {
            const { id, ...dealData } = deal;
            const dealDocRef = doc(db, 'deals', id);
            batch.set(dealDocRef, dealData);

            // Seed subcollections
            const tasksForDeal = mockTasks.filter(t => t.dealId === id);
            tasksForDeal.forEach(task => {
                const { dealId, id: taskId, dueDate, ...taskData } = task;
                const taskDocRef = doc(db, `deals/${deal.id}/tasks`, taskId);
                batch.set(taskDocRef, {...taskData, dueDate: dueDate ? Timestamp.fromDate(dueDate) : undefined });
            });

            const notesForDeal = mockNotes.filter(n => n.dealId === id);
            notesForDeal.forEach(note => {
                 const { dealId, id: noteId, createdAt, ...noteData } = note;
                const noteDocRef = doc(db, `deals/${deal.id}/notes`, noteId);
                batch.set(noteDocRef, {...noteData, createdAt: Timestamp.fromDate(createdAt) });
            });
        });
    }

    try {
        await batch.commit();
        console.log("Database seeded successfully!");
        return { success: true, message: "Banco de dados populado com sucesso!" };
    } catch (error: any) {
        console.error("Error seeding database: ", error);
        return { success: false, message: `Erro ao popular o banco de dados: ${error.message}` };
    }
};
