'use client'

import { useState, useEffect } from "react";
import { firestore } from '@/firebase';
import { Box, Modal, Stack, TextField, Typography, Button } from "@mui/material";
import { collection, query, getDocs, deleteDoc, setDoc, doc, getDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const [recipe, setRecipe] = useState(""); // State to manage recipe

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
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useEffect(() => {
    updateInventory();
  }, []);

  // Filtered inventory based on search query
  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const generateRecipe = async () => {
  //   const items = inventory.map(item => item.name);
  
  //   try {
  //     const response = await fetch('/api/getRecipe', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ items }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  
  //     const result = await response.json();
  //     setRecipe(result.recipe || "No recipe found."); // Adjust based on your API response structure
  //   } catch (error) {
  //     console.error('Error fetching recipe:', error);
  //     setRecipe("Error fetching recipe. Please try again.");
  //   }
  // };
  
  

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{ padding: 2, backgroundColor: '#f5f5dc' }} // Light blue background
    >
      {/* Title */}
      <Typography variant="h1" color="#333" mb={2}>
        Inventory Management System
      </Typography>

      {/* Top Container for Buttons */}
      <Box width="100%" maxWidth="800px" display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
      </Box>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: "100%", maxWidth: "800px", marginBottom: 2 }}
      />

      {/* Inventory List */}
      <Box border="1px solid #333" width="100%" maxWidth="800px">
        <Box height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>

        <Stack width="100%" height="500px" spacing={2} overflow="auto">
          {
            filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Typography variant="h3" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() =>
                    addItem(name)
                  }>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() =>
                    removeItem(name)
                  }>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
        </Stack>
      </Box>

      {/* Display Recipe */}
      {recipe && (
        <Box mt={4} width="100%" maxWidth="800px">
          <Typography variant="h6" mb={2}>
            Suggested Recipe:
          </Typography>
          <Typography>{recipe}</Typography>
        </Box>
      )}

      {/* Add Item Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h6"> Add Item </Typography>
          <Stack width="100%" direction="row" spacing={2}></Stack>
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
    </Box>
  );
}
