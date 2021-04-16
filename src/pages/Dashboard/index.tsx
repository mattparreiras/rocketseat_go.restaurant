import { FormEvent, useEffect, useState } from 'react';

import {Header} from '../../components/Header/index';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';


interface FoodSchema {
  "id": number,
  "name": string,
  "description": string,
  "price": string,
  "available": boolean,
  "image": string
}

function Dashboard (){
  const [foods, setFoods] = useState<FoodSchema[]>([])
  const [editingFood,setEditingFood] = useState<FoodSchema>({} as FoodSchema)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  
  useEffect(()=>{
    async function getFoods(){
      const response = await api.get('/foods');
      setFoods(response.data);    
    }
    getFoods()
  },[])
  
  async function handleAddFood (food:FormEvent) {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food: FormEvent) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function  handleDeleteFood (id:number){
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  }

  function toggleModal (){
    setModalOpen(!modalOpen);
  }

  function toggleEditModal (){
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood (food: FoodSchema){
    setEditingFood(food)
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );

};

export default Dashboard;
