'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from '@/firebase';
import { Box, Modal, Stack, TextField, Typography, Button } from "@mui/material";
import { collection, query, getDocs, deleteDoc, setDoc } from 'firebase/firestore';
import { Butterfly_Kids } from "next/font/google";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState();

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity -1})
      }
    }
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box 
      width = "100vw" 
      height = "100vh" 
      display = "flex" 
      justifyContent="center" 
      alignItems="center"
      gap = {2}
    >
      <Modal open = {open} onClose = {handleClose}> 
        <Box
        position = "absolute"
        top = "50%" 
        left = "50%" 
        width = {400}
        bgcolor = "white"
        border = "2px solid #000"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx = {{
          transform: 'translate(-50%,-50%)'
        }}
        >
          <Typography variant="h6"> Add Item </Typography>
          <Stack width="100%" direction = "row" spacing={2} ></Stack>
          <Box display="flex" alignItems="center" mt={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant='outlined'
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{ marginLeft: 2 }}
            >
              Add
            </Button>
      </Box>
        </Box>
      </Modal>
      <Button variant = "contained" onClick = {() => {
        handleOpen()
      }}>
        Add New Item
      </Button>
      <Box boarder="1px solid #333">
        <Box
        width = "800px" height = "100px"
        >
          
        </Box>
      </Box>
      {/* <Typography variant="h1">Inventory Management</Typography> */}
    </Box>
  );
}
