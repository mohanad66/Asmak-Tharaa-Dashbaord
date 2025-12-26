import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Button,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Grid,
  CardMedia,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Chip,
  Avatar,
  InputAdornment,
} from "@mui/material";

const BASE_URL = "https://tharaa.premiumasp.net/api/menu";

function MenuManager() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    nameAR: "",
    imageUrl: "",
    price: '',
    description: "",
    descriptionAR: "",
    calories: '',
    isAvailable: true,
    category: 0,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Memoized categories to prevent re-renders
  const categories = useMemo(() => ({
    0: "Salads",
    1: "Soups",
    2: "Appetizers",
    3: "Fried Fish",
    4: "Grilled Fish",
    5: "Oven Fish",
    6: "Tagines",
    7: "Rice and Macaroni",
    8: "Side Orders",
    9: "Desserts",
    10: "Cold Beverages",
    11: "Hot Beverages",
    12: "offers"
  }), []);

  // Fetch all products - memoized with useCallback
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/products`);
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = products.filter(product => {
      return (
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.nameAR && product.nameAR.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.descriptionAR && product.descriptionAR.toLowerCase().includes(query)) ||
        (product.price && product.price.toString().includes(query)) ||
        (product.calories && product.calories.toString().includes(query)) ||
        (categories[product.category] && categories[product.category].toLowerCase().includes(query))
      );
    });
    
    setFilteredProducts(filtered);
  }, [searchQuery, products, categories]);

  // Validate form data - memoized
  const validateForm = useCallback((product) => {
    const newErrors = {};

    if (!product.name?.trim()) {
      newErrors.name = "Product name is required";
    } else if (product.name.length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    }

    if (!product.nameAR?.trim()) {
      newErrors.nameAR = "Arabic name is required";
    } else if (product.nameAR.length < 2) {
      newErrors.nameAR = "Arabic name must be at least 2 characters";
    }

    if (!product.imageUrl?.trim()) {
      newErrors.imageUrl = "Image URL is required";
    }

    if (product.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    if (product.calories < 0) {
      newErrors.calories = "Calories cannot be negative";
    }

    if (product.description?.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (product.descriptionAR?.length > 500) {
      newErrors.descriptionAR = "Arabic description cannot exceed 500 characters";
    }

    return newErrors;
  }, []);

  // Add new product
  const handleAddProduct = async () => {
    const formErrors = validateForm(newProduct);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/product`, newProduct);
      
      toast.success("Product added successfully!");
      fetchProducts();
      
      setNewProduct({
        name: "",
        nameAR: "",
        imageUrl: "",
        price: '',
        description: "",
        descriptionAR: "",
        calories: '',
        isAvailable: true,
        category: 0,
      });
      setErrors({});
      
    } catch (error) {
      console.error("Error adding product:", error);
      
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Invalid data. Please check your inputs.");
        } else if (error.response.status === 409) {
          toast.error("A product with this name already exists.");
        } else {
          toast.error("Failed to add product. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const handleUpdateProduct = async () => {
    if (!editingProduct || !editingProduct.id) return;
    
    const formErrors = validateForm(editingProduct);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${BASE_URL}/product/${editingProduct.id}`,
        editingProduct
      );
      
      toast.success("Product updated successfully!");
      fetchProducts();
      setEditingProduct(null);
      setErrors({});
      
    } catch (error) {
      console.error("Error updating product:", error);
      
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("Product not found. It may have been deleted.");
        } else if (error.response.status === 400) {
          toast.error("Invalid data. Please check your inputs.");
        } else {
          toast.error("Failed to update product. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/product/${id}`);
      
      toast.success("Product deleted successfully!");
      fetchProducts();
      
    } catch (error) {
      console.error("Error deleting product:", error);
      
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("Product not found. It may have been already deleted.");
        } else {
          toast.error("Failed to delete product. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Start editing product - fixed data handling
  const startEditing = (product) => {
    // Clean and normalize the product data
    const cleanProduct = {
      id: product.id,
      name: product.name || "",
      nameAR: product.nameAR || "",
      imageUrl: product.imageUrl || "",
      price: product.price !== undefined && product.price !== null ? product.price : '',
      description: product.description || "",
      descriptionAR: product.descriptionAR || "",
      calories: product.calories !== undefined && product.calories !== null ? product.calories : '',
      isAvailable: Boolean(product.isAvailable),
      category: product.category !== undefined && product.category !== null ? product.category : 0,
    };
    
    setEditingProduct(cleanProduct);
    setErrors({});
  };

  // View product details
  const handleViewProduct = (product) => {
    // Clean the product data before setting
    const cleanProduct = {
      ...product,
      price: product.price || 0,
      calories: product.calories || 0,
      nameAR: product.nameAR || 'N/A',
      descriptionAR: product.descriptionAR || 'لا يوجد وصف',
    };
    setSelectedProduct(cleanProduct);
    setViewDialogOpen(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProduct(null);
    setErrors({});
  };

  // Handle input change for new product with debounce
  const handleNewProductChange = useCallback((field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  // Handle input change for editing product with debounce
  const handleEditProductChange = useCallback((field, value) => {
    setEditingProduct(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  // Optimized input handler
  const handleInputChange = useCallback((e, isEditing, field) => {
    const target = e.target;
    let value = target.value;
    
    if (target.type === "checkbox") {
      value = target.checked;
    } else if (field === "price" || field === "calories" || field === "category") {
      // Handle numeric fields properly
      if (value === '' || value === null || value === undefined) {
        value = '';
      } else {
        const numValue = Number(value);
        value = isNaN(numValue) ? '' : numValue;
      }
    }

    if (isEditing) {
      handleEditProductChange(field, value);
    } else {
      handleNewProductChange(field, value);
    }
  }, [handleEditProductChange, handleNewProductChange]);

  // Get category name - memoized
  const getCategoryName = useCallback((categoryId) => {
    return categories[categoryId] || `Category ${categoryId}`;
  }, [categories]);

  // Render category options - memoized
  const renderCategoryOptions = useMemo(() => {
    return Object.keys(categories).map(key => (
      <MenuItem key={key} value={parseInt(key)}>
        {categories[key]}
      </MenuItem>
    ));
  }, [categories]);

  // Calculate description length safely
  const getDescriptionLength = useCallback((text) => {
    return text?.length || 0;
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Render product rows - memoized for performance
  const renderProductRows = useMemo(() => {
    return filteredProducts?.map((product) => (
      <TableRow 
        key={product.id}
        hover
        sx={{ 
          '&:last-child td, &:last-child th': { border: 0 },
          backgroundColor: product.isAvailable ? 'inherit' : 'action.hover'
        }}
      >
        <TableCell>{product.id}</TableCell>
        <TableCell>
          <Tooltip title="View Image">
            <Avatar
              src={
                product?.imageUrl?.includes("drive.google.com")
                  ? `https://lh3.googleusercontent.com/d/${
                      product.imageUrl.match(/\/d\/([^/]+)\//)?.[1]
                    }`
                  : product?.imageUrl
              }
              alt={product?.name}
              sx={{
                width: 50,
                height: 50,
                cursor: 'pointer'
              }}
              onClick={() => handleViewProduct(product)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/50x50?text=No+Image";
              }}
            />
          </Tooltip>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight="medium">
            {product.name || 'N/A'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight="medium" dir="rtl">
            {product.nameAR || 'N/A'}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip 
            label={`${Number(product.price || 0).toFixed(2)}`} 
            color="primary" 
            size="small"
            variant="outlined"
          />
        </TableCell>
        <TableCell>
          <Chip 
            label={`${product.calories || 0} cal`} 
            color="secondary" 
            size="small"
            variant="outlined"
          />
        </TableCell>
        <TableCell>
          <Chip
            label={product.isAvailable ? "Available" : "Not Available"}
            color={product.isAvailable ? "success" : "error"}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Typography variant="body2" noWrap>
            {getCategoryName(product.category)}
          </Typography>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View Details">
              <IconButton
                color="info"
                size="small"
                onClick={() => handleViewProduct(product)}
                disabled={loading}
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                color="warning"
                size="small"
                onClick={() => startEditing(product)}
                disabled={loading}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDeleteProduct(product.id)}
                disabled={loading}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
    ));
  }, [filteredProducts, loading, getCategoryName, handleDeleteProduct, handleViewProduct]);

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Menu Manager
        </Typography>
        
        <TextField
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  ✕
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Form for adding/editing */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.secondary' }}>
          {editingProduct ? "Edit Product" : "Add New Product"}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Name (English) *"
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChange={(e) => handleInputChange(e, !!editingProduct, "name")}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Name (Arabic) *"
              value={editingProduct ? editingProduct.nameAR || '' : newProduct.nameAR}
              onChange={(e) => handleInputChange(e, !!editingProduct, "nameAR")}
              error={!!errors.nameAR}
              helperText={errors.nameAR}
              disabled={loading}
              dir="rtl"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL *"
              value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
              onChange={(e) => handleInputChange(e, !!editingProduct, "imageUrl")}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={(e) => handleInputChange(e, !!editingProduct, "price")}
              error={!!errors.price}
              helperText={errors.price}
              disabled={loading}
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Calories"
              type="number"
              value={editingProduct ? editingProduct.calories : newProduct.calories}
              onChange={(e) => handleInputChange(e, !!editingProduct, "calories")}
              error={!!errors.calories}
              helperText={errors.calories}
              disabled={loading}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description (English)"
              multiline
              rows={3}
              value={editingProduct ? editingProduct.description : newProduct.description}
              onChange={(e) => handleInputChange(e, !!editingProduct, "description")}
              error={!!errors.description}
              helperText={errors.description || `${getDescriptionLength(editingProduct ? editingProduct.description : newProduct.description)} / 500 characters`}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description (Arabic)"
              multiline
              rows={3}
              value={editingProduct ? editingProduct.descriptionAR || '' : newProduct.descriptionAR}
              onChange={(e) => handleInputChange(e, !!editingProduct, "descriptionAR")}
              error={!!errors.descriptionAR}
              helperText={errors.descriptionAR || `${getDescriptionLength(editingProduct ? editingProduct.descriptionAR : newProduct.descriptionAR)} / 500 characters`}
              disabled={loading}
              dir="rtl"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={editingProduct ? editingProduct.category : newProduct.category}
                onChange={(e) => handleInputChange(e, !!editingProduct, "category")}
                label="Category"
                disabled={loading}
              >
                {renderCategoryOptions}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={editingProduct ? editingProduct.isAvailable : newProduct.isAvailable}
                  onChange={(e) => handleInputChange(e, !!editingProduct, "isAvailable")}
                  disabled={loading}
                />
              }
              label="Available"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {editingProduct ? (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleUpdateProduct}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={cancelEditing}
                disabled={loading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddProduct}
              disabled={loading}
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : "Add Product"}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Products Table */}
      {loading && filteredProducts.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Alert severity={searchQuery ? "warning" : "info"} sx={{ mb: 3 }}>
          {searchQuery ? `No products found for "${searchQuery}"` : "No products in the menu. Start by adding new products using the form above."}
        </Alert>
      ) : (
        <Box sx={{ width: '100%', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Products List ({filteredProducts.length} of {products.length})
              {searchQuery && (
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 2 }}>
                  Search results for "{searchQuery}"
                </Typography>
              )}
            </Typography>
          </Box>
          
          <TableContainer 
            component={Paper} 
            elevation={2} 
            sx={{ 
              maxHeight: 600,
              '& .MuiTable-root': {
                minWidth: 1000,
              }
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 50 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Name (EN)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Name (AR)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Calories</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderProductRows}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* View Product Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle>
              Product Details
              <Chip
                label={selectedProduct.isAvailable ? "Available" : "Not Available"}
                color={selectedProduct.isAvailable ? "success" : "error"}
                size="small"
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <CardMedia
                    component="img"
                    src={
                      selectedProduct?.imageUrl?.includes("drive.google.com")
                        ? `https://lh3.googleusercontent.com/d/${
                            selectedProduct.imageUrl.match(/\/d\/([^/]+)\//)?.[1]
                          }`
                        : selectedProduct?.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={selectedProduct?.name}
                    sx={{
                      width: '100%',
                      height: 200,
                      borderRadius: 1,
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        {selectedProduct.name || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" dir="rtl">
                        {selectedProduct.nameAR || 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Price
                      </Typography>
                      <Typography variant="body1">
                        {Number(selectedProduct.price || 0).toFixed(2)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Calories
                      </Typography>
                      <Typography variant="body1">
                        {selectedProduct.calories || 0} cal
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1">
                        {getCategoryName(selectedProduct.category)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Description (English)
                      </Typography>
                      <Typography variant="body2">
                        {selectedProduct.description || 'No description'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Description (Arabic)
                      </Typography>
                      <Typography variant="body2" dir="rtl">
                        {selectedProduct.descriptionAR || 'لا يوجد وصف'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              <Button 
                variant="contained" 
                color="warning"
                startIcon={<EditIcon />}
                onClick={() => {
                  setViewDialogOpen(false);
                  startEditing(selectedProduct);
                }}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default MenuManager;