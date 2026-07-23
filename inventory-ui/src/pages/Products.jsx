import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import api from "../services/api";
import { FiPlus, FiMinus, FiClock, FiX, FiDownload } from "react-icons/fi";
import "../styles/products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  // Stock Modal
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockProduct, setStockProduct] = useState(null);
  const [stockType, setStockType] = useState("IN");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockReason, setStockReason] = useState("");

  // History Modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyProduct, setHistoryProduct] = useState(null);
  const [history, setHistory] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
    lowStockThreshold: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAll();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    try {
      if (keyword.trim() === "") {
        fetchProducts();
      } else {
        const res = await productService.search(keyword);
        setProducts(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      price: "",
      quantity: "",
      lowStockThreshold: "",
      categoryId: "",
    });
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      sku: product.sku || "",
      price: product.price || "",
      quantity: product.quantity || "",
      lowStockThreshold: product.lowStockThreshold || "",
      categoryId: product.category?.id || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      sku: formData.sku || null,
      price: parseFloat(formData.price) || 0,
      quantity: parseInt(formData.quantity) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold) || 0,
      category: formData.categoryId
        ? { id: parseInt(formData.categoryId) }
        : null,
    };

    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, payload);
      } else {
        await productService.create(payload);
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      try {
        await productService.delete(id);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Stock In/Out
  const openStockModal = (product, type) => {
    setStockProduct(product);
    setStockType(type);
    setStockQuantity("");
    setStockReason("");
    setShowStockModal(true);
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = stockType === "IN" ? "/stock/in" : "/stock/out";
      await api.post(endpoint, {
        productId: stockProduct.id,
        quantity: parseInt(stockQuantity),
        reason: stockReason,
      });
      setShowStockModal(false);
      fetchProducts();
      alert(
        `Stock ${stockType === "IN" ? "added" : "removed"} successfully!`
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Stock update failed");
    }
  };

  // History
  const openHistory = async (product) => {
    setHistoryProduct(product);
    try {
      const res = await api.get(`/stock/history/${product.id}`);
      setHistory(res.data);
    } catch (err) {
      setHistory([]);
    }
    setShowHistoryModal(true);
  };

  // CSV Export
  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/products/export/csv",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `products-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV Export error:", err);
      alert("Failed to export CSV");
    }
  };

  // Filter logic
  const filteredProducts = products.filter((product) => {
    if (categoryFilter && product.category?.id !== parseInt(categoryFilter)) {
      return false;
    }
    if (stockFilter === "low" && product.quantity > product.lowStockThreshold) {
      return false;
    }
    if (stockFilter === "out" && product.quantity > 0) {
      return false;
    }
    if (stockFilter === "in" && product.quantity <= product.lowStockThreshold) {
      return false;
    }
    return true;
  });

  const isLowStock = (product) => product.quantity <= product.lowStockThreshold;
  const isOutOfStock = (product) => product.quantity <= 0;

  const getStockStatus = (product) => {
    if (isOutOfStock(product))
      return { label: "Out of Stock", class: "badge-out" };
    if (isLowStock(product))
      return { label: "Low Stock", class: "badge-danger" };
    return { label: "In Stock", class: "badge-success" };
  };

  return (
    <div className="products-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          {/* Page Header */}
          <motion.div
            className="page-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>Products</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-export" onClick={handleExportCSV}>
                <FiDownload size={16} /> Export CSV
              </button>
              <button className="btn-add" onClick={openAddModal}>
                + Add Product
              </button>
            </div>
          </motion.div>

          {/* Search & Filters */}
          <div className="filters-bar">
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All Stock Status</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="loading-spinner">Loading products...</div>
          ) : (
            <div className="table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-data">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const status = getStockStatus(product);
                      return (
                        <tr
                          key={product.id}
                          className={
                            isLowStock(product) || isOutOfStock(product)
                              ? "low-stock-row"
                              : ""
                          }
                        >
                          <td style={{ fontWeight: 500 }}>{product.name}</td>
                          <td style={{ color: "#6b7280" }}>
                            {product.sku || "-"}
                          </td>
                          <td>₹{product.price?.toLocaleString() || "0"}</td>
                          <td>{product.quantity || 0}</td>
                          <td>{product.category?.name || "-"}</td>
                          <td>
                            <span className={`badge ${status.class}`}>
                              {status.label}
                            </span>
                          </td>
                          <td>
                            <div className="stock-actions">
                              <button
                                className="stock-btn stock-in-btn"
                                onClick={() => openStockModal(product, "IN")}
                                title="Stock In"
                              >
                                <FiPlus size={14} />
                              </button>
                              <button
                                className="stock-btn stock-out-btn"
                                onClick={() => openStockModal(product, "OUT")}
                                title="Stock Out"
                                disabled={product.quantity <= 0}
                              >
                                <FiMinus size={14} />
                              </button>
                              <button
                                className="stock-btn stock-history-btn"
                                onClick={() => openHistory(product)}
                                title="History"
                              >
                                <FiClock size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="action-buttons">
                            <button
                              className="btn-edit"
                              onClick={() => openEditModal(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() =>
                                handleDelete(product.id, product.name)
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Low Stock Threshold</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    {editingProduct ? "Update" : "Add Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock In/Out Modal */}
      <AnimatePresence>
        {showStockModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStockModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "440px" }}
            >
              <h3>
                Stock {stockType === "IN" ? "In" : "Out"} - {stockProduct?.name}
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                Current Stock:{" "}
                <strong style={{ color: "#e2e8f0" }}>
                  {stockProduct?.quantity}
                </strong>
              </p>
              <form onSubmit={handleStockSubmit}>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    required
                    min="1"
                    max={
                      stockType === "OUT" ? stockProduct?.quantity : undefined
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Reason *</label>
                  <input
                    type="text"
                    value={stockReason}
                    onChange={(e) => setStockReason(e.target.value)}
                    required
                    placeholder={
                      stockType === "IN"
                        ? "e.g., New shipment arrived"
                        : "e.g., Sold to customer"
                    }
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowStockModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Confirm Stock {stockType === "IN" ? "In" : "Out"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "600px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  Stock History - {historyProduct?.name}
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#6b7280",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                >
                  <FiX />
                </button>
              </div>
              {history.length === 0 ? (
                <p
                  style={{
                    color: "#6b7280",
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No stock movements yet
                </p>
              ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Qty</th>
                        <th>Reason</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h) => (
                        <tr key={h.id}>
                          <td>
                            <span
                              className={`badge ${
                                h.type === "IN"
                                  ? "badge-success"
                                  : "badge-danger"
                              }`}
                            >
                              {h.type === "IN" ? "IN" : "OUT"}
                            </span>
                          </td>
                          <td>{h.quantity}</td>
                          <td style={{ color: "#9ca3af" }}>{h.reason}</td>
                          <td
                            style={{ color: "#6b7280", fontSize: "12px" }}
                          >
                            {new Date(h.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;