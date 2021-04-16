import { FormEvent, createRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';


interface Food {
  "name": string,
  "description": string,
  "price": string,
  "available": boolean,
  "image": string
}

interface ModalAddFoodProps{
  isOpen: boolean, 
  setIsOpen: ()=>void,
  handleUpdateFood:(data:FormEvent)=>Promise<void>,
  editingFood:Food 
}

function ModalEditFood (props:ModalAddFoodProps) {
  const formRef = createRef<FormHandles>();
  const { isOpen, setIsOpen, editingFood } = props;
  

  async function handleSubmit (data:FormEvent) {
    const { setIsOpen, handleUpdateFood } = props;

    handleUpdateFood(data);
    setIsOpen();
  }


  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
