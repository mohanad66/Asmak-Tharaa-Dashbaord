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
import { useTranslation } from "react-i18next";

const BASE_URL = "api/";

function MenuManager() {
  const { t } = useTranslation();
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
    0: t('salads'),
    1: t('soups'),
    2: t('appetizers'),
    3: t('fried_fish'),
    4: t('grilled_fish'),
    5: t('oven_fish'),
    6: t('tagines'),
    7: t('rice_and_macaroni'),
    8: t('side_orders'),
    9: t('desserts'),
    10: t('cold_beverages'),
    11: t('hot_beverages'),
    12: t('offers')
  }), [t]);

  // Fetch all products - memoized with useCallback
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}products`);
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(t('failed_to_load_products'));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
      newErrors.name = t('product_name_required');
    } else if (product.name.length < 2) {
      newErrors.name = t('product_name_min_length');
    }

    if (!product.nameAR?.trim()) {
      newErrors.nameAR = t('arabic_name_required');
    } else if (product.nameAR.length < 2) {
      newErrors.nameAR = t('arabic_name_min_length');
    }

    if (!product.imageUrl?.trim()) {
      newErrors.imageUrl = t('image_url_required');
    }

    if (product.price < 0) {
      newErrors.price = t('price_cannot_be_negative');
    }

    if (product.calories < 0) {
      newErrors.calories = t('calories_cannot_be_negative');
    }

    if (product.description?.length > 500) {
      newErrors.description = t('description_cannot_exceed_500_chars');
    }

    if (product.descriptionAR?.length > 500) {
      newErrors.descriptionAR = t('arabic_description_cannot_exceed_500_chars');
    }

    return newErrors;
  }, [t]);

  // Add new product
  const handleAddProduct = async () => {
    const formErrors = validateForm(newProduct);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error(t('please_fix_errors_in_form'));
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/product`, newProduct);

      toast.success(t('product_added_successfully'));
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
          toast.error(t('invalid_data_check_inputs'));
        } else if (error.response.status === 409) {
          toast.error(t('product_with_this_name_exists'));
        } else {
          toast.error(t('failed_to_add_product'));
        }
      } else {
        toast.error(t('network_error_check_connection'));
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
      toast.error(t('please_fix_errors_in_form'));
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${BASE_URL}/product/${editingProduct.id}`,
        editingProduct
      );

      toast.success(t('product_updated_successfully'));
      fetchProducts();
      setEditingProduct(null);
      setErrors({});

    } catch (error) {
      console.error("Error updating product:", error);

      if (error.response) {
        if (error.response.status === 404) {
          toast.error(t('product_not_found_may_be_deleted'));
        } else if (error.response.status === 400) {
          toast.error(t('invalid_data_check_inputs'));
        } else {
          toast.error(t('failed_to_update_product'));
        }
      } else {
        toast.error(t('network_error_check_connection'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm(t('are_you_sure_delete_product'))) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/product/${id}`);

      toast.success(t('product_deleted_successfully'));
      fetchProducts();

    } catch (error) {
      console.error("Error deleting product:", error);

      if (error.response) {
        if (error.response.status === 404) {
          toast.error(t('product_not_found_already_deleted'));
        } else {
          toast.error(t('failed_to_delete_product'));
        }
      } else {
        toast.error(t('network_error_check_connection'));
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
      nameAR: product.nameAR || t('n_a'),
      descriptionAR: product.descriptionAR || t('no_description_ar'),
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
    return categories[categoryId] || `${t('category')} ${categoryId}`;
  }, [categories, t]);

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
          <Tooltip title={t('view_image')}>
            <Avatar
              src={
                product?.imageUrl?.includes("drive.google.com")
                  ? `https://lh3.googleusercontent.com/d/${product.imageUrl.match(/\/d\/([^/]+)\//)?.[1]
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
            {product.name || t('n_a')}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight="medium" dir="rtl">
            {product.nameAR || t('n_a')}
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
            label={`${product.calories || 0} ${t('cal')}`}
            color="secondary"
            size="small"
            variant="outlined"
          />
        </TableCell>
        <TableCell>
          <Chip
            label={product.isAvailable ? t('available') : t('not_available')}
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
            <Tooltip title={t('view_details')}>
              <IconButton
                color="info"
                size="small"
                onClick={() => handleViewProduct(product)}
                disabled={loading}
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('edit')}>
              <IconButton
                color="warning"
                size="small"
                onClick={() => startEditing(product)}
                disabled={loading}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('delete')}>
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
  }, [filteredProducts, loading, getCategoryName, handleDeleteProduct, handleViewProduct, t]);

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
          {t('menu_manager')}
        </Typography>

        <TextField
          placeholder={t('search_products')}
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
          {editingProduct ? t('edit_product') : t('add_new_product')}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('product_name_english')}
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
              label={t('product_name_arabic')}
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
              label={t('image_url')}
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
              label={t('price')}
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
              label={t('calories')}
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
              label={t('description_english')}
              multiline
              rows={3}
              value={editingProduct ? editingProduct.description : newProduct.description}
              onChange={(e) => handleInputChange(e, !!editingProduct, "description")}
              error={!!errors.description}
              helperText={errors.description || `${getDescriptionLength(editingProduct ? editingProduct.description : newProduct.description)} / ${t('500_characters')}`}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('description_arabic')}
              multiline
              rows={3}
              value={editingProduct ? editingProduct.descriptionAR || '' : newProduct.descriptionAR}
              onChange={(e) => handleInputChange(e, !!editingProduct, "descriptionAR")}
              error={!!errors.descriptionAR}
              helperText={errors.descriptionAR || `${getDescriptionLength(editingProduct ? editingProduct.descriptionAR : newProduct.descriptionAR)} / ${t('500_characters')}`}
              disabled={loading}
              dir="rtl"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('category')}</InputLabel>
              <Select
                value={editingProduct ? editingProduct.category : newProduct.category}
                onChange={(e) => handleInputChange(e, !!editingProduct, "category")}
                label={t('category')}
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
              label={t('available')}
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
                {loading ? <CircularProgress size={24} /> : t('save_changes')}
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={cancelEditing}
                disabled={loading}
              >
                {t('cancel')}
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
              {loading ? <CircularProgress size={24} /> : t('add_product')}
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
          {searchQuery ? `${t('no_products_found_for')} "${searchQuery}"` : t('no_products_in_menu_add_new')}
        </Alert>
      ) : (
        <Box sx={{ width: '100%', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              {t('products_list')} ({filteredProducts.length} {t('of')} {products.length})
              {searchQuery && (
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 2 }}>
                  {t('search_results_for')} "{searchQuery}"
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
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>{t('image')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>{t('name_en')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>{t('name_ar')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>{t('price')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>{t('calories')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>{t('status')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>{t('category')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>{t('actions')}</TableCell>
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
              {t('product_details')}
              <Chip
                label={selectedProduct.isAvailable ? t('available') : t('not_available')}
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
                        ? `https://lh3.googleusercontent.com/d/${selectedProduct.imageUrl.match(/\/d\/([^/]+)\//)?.[1]
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
                        {selectedProduct.name || t('n_a')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" dir="rtl">
                        {selectedProduct.nameAR || t('n_a')}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('price')}
                      </Typography>
                      <Typography variant="body1">
                        {Number(selectedProduct.price || 0).toFixed(2)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('calories')}
                      </Typography>
                      <Typography variant="body1">
                        {selectedProduct.calories || 0} {t('cal')}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('category')}
                      </Typography>
                      <Typography variant="body1">
                        {getCategoryName(selectedProduct.category)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('description_english')}
                      </Typography>
                      <Typography variant="body2">
                        {selectedProduct.description || t('no_description')}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('description_arabic')}
                      </Typography>
                      <Typography variant="body2" dir="rtl">
                        {selectedProduct.descriptionAR || t('no_description_ar')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>{t('close')}</Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={<EditIcon />}
                onClick={() => {
                  setViewDialogOpen(false);
                  startEditing(selectedProduct);
                }}
              >
                {t('edit')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default MenuManager;