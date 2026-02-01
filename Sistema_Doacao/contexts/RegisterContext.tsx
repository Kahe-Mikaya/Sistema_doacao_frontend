import { createContext, useContext, useState, ReactNode } from 'react';

type Location = {
  latitude: number;
  longitude: number;
};

type RegisterData = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  tipo: 'PF' | 'PJ';
  cpf: string;
  cnpj: string;
  foto: string | null;
  location: Location | null;
  descricao: string;
};

type RegisterContextType = {
  data: RegisterData;
  setData: (data: Partial<RegisterData>) => void;
};

const RegisterContext = createContext({} as RegisterContextType);

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<RegisterData>({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    tipo: 'PF',
    cpf: '',
    cnpj: '',
    foto: null,
    location: null,
    descricao: '',
  });

  function setData(newData: Partial<RegisterData>) {
    setDataState((prev) => ({ ...prev, ...newData }));
  }

  return (
    <RegisterContext.Provider value={{ data, setData }}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  return useContext(RegisterContext);
}
