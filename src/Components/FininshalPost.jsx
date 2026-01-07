import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FiDollarSign,
  FiCalendar,
  FiPackage,
  FiTruck,
  FiTool,
  FiCpu,
  FiCreditCard,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiRefreshCw,
  FiSave
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const FinancialManagementForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: new Date(),
    revenue: '',
    expense: '',
    buyProducts: '',
    transportation: '',
    repairs: '',
    technology: '',
    account: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errors, setErrors] = useState({});
  const [calculation, setCalculation] = useState({
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0
  });

  // Calculate expenses and profit when expense-related fields change
  useEffect(() => {
    const expenses = [
      parseFloat(formData.buyProducts) || 0,
      parseFloat(formData.transportation) || 0,
      parseFloat(formData.repairs) || 0,
      parseFloat(formData.technology) || 0,
      parseFloat(formData.account) || 0
    ];

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense, 0);
    const revenue = parseFloat(formData.revenue) || 0;
    const netProfit = revenue - totalExpenses;
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    setCalculation({
      totalExpenses,
      netProfit,
      profitMargin: profitMargin.toFixed(2)
    });

    // Update expense field automatically
    if (totalExpenses !== (parseFloat(formData.expense) || 0)) {
      setFormData(prev => ({
        ...prev,
        expense: totalExpenses.toString()
      }));
    }
  }, [formData.buyProducts, formData.transportation, formData.repairs,
  formData.technology, formData.account, formData.revenue]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = t('date_is_required');
    }

    const revenue = parseFloat(formData.revenue);
    if (isNaN(revenue) || revenue < 0) {
      newErrors.revenue = t('revenue_must_be_positive_number');
    }

    // Validate all numeric fields
    const numericFields = ['buyProducts', 'transportation', 'repairs', 'technology', 'account'];
    numericFields.forEach(field => {
      const value = parseFloat(formData[field]);
      if (formData[field] && (isNaN(value) || value < 0)) {
        newErrors[field] = t('must_be_positive_number');
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));

    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('please_fix_errors_in_form'));
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const token = JSON.parse(localStorage.getItem('token'));

      // Prepare data for API
      const apiData = {
        date: formData.date.toISOString(),
        revenue: parseFloat(formData.revenue) || 0,
        expense: parseFloat(formData.expense) || 0,
        buyProducts: parseFloat(formData.buyProducts) || 0,
        transportation: parseFloat(formData.transportation) || 0,
        repairs: parseFloat(formData.repairs) || 0,
        technology: parseFloat(formData.technology) || 0,
        account: parseFloat(formData.account) || 0,
        notes: formData.notes || ''
      };

      const response = await axios.post(
        'api/FinancialManagement',
        apiData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setResponse({
        success: true,
        data: response.data,
        timestamp: new Date().toLocaleString(),
        message: t('financial_record_added_successfully')
      });
      toast.success(t('financial_record_added_successfully'));

    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || error.message || t('failed_to_add_financial_record');
      toast.error(errorMessage);
      setResponse({
        success: false,
        error: errorMessage,
        timestamp: new Date().toLocaleString(),
        details: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Inline styles - مصممة لتكون responsive
  const styles = {
    container: {
      maxWidth: '100%',
      margin: '0 auto',
      padding: '10px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      overflowX: 'hidden'
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      padding: '20px 15px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '15px',
      color: 'white',
      boxShadow: '0 5px 15px rgba(102, 126, 234, 0.2)'
    },
    title: {
      fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
      fontWeight: '700',
      marginBottom: '10px',
      letterSpacing: '-0.5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      flexWrap: 'wrap'
    },
    subtitle: {
      fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
      opacity: '0.9',
      maxWidth: '100%',
      margin: '0 auto',
      lineHeight: '1.5',
      padding: '0 10px'
    },
    mainGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%'
    },
    formCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s ease',
      width: '100%',
      order: 1
    },
    summaryCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      width: '100%',
      order: 2
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '20px',
      position: 'relative'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#2d3748',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.3px'
    },
    input: {
      width: '100%',
      padding: '12px 15px 12px 40px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: '#f8fafc',
      boxSizing: 'border-box',
      '&:focus': {
        borderColor: '#667eea',
        backgroundColor: 'white',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
      }
    },
    textarea: {
      width: '100%',
      padding: '12px 15px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: '#f8fafc',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      '&:focus': {
        borderColor: '#667eea',
        backgroundColor: 'white',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
      }
    },
    datePicker: {
      width: '100%',
      padding: '12px 15px 12px 40px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '1rem',
      backgroundColor: '#f8fafc',
      cursor: 'pointer',
      boxSizing: 'border-box',
      '&:focus': {
        borderColor: '#667eea',
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
      }
    },
    errorText: {
      color: '#e53e3e',
      fontSize: '0.85rem',
      marginTop: '6px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '2px solid #edf2f7'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '16px 20px',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      letterSpacing: '0.5px',
      gap: '10px',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
      },
      '&:disabled': {
        opacity: '0.6',
        cursor: 'not-allowed',
        transform: 'none'
      }
    },
    resetButton: {
      backgroundColor: '#a0aec0',
      color: 'white',
      border: 'none',
      padding: '16px 20px',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      gap: '10px',
      '&:hover': {
        backgroundColor: '#718096',
        transform: 'translateY(-2px)'
      }
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 15px',
      textAlign: 'center'
    },
    responseCard: {
      backgroundColor: response?.success ? '#f0fff4' : '#fff5f5',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '25px',
      borderLeft: '5px solid',
      borderLeftColor: response?.success ? '#38a169' : '#e53e3e',
      width: '100%',
      boxSizing: 'border-box'
    },
    responseHeader: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '15px',
      paddingBottom: '15px',
      borderBottom: '2px solid',
      borderBottomColor: response?.success ? '#c6f6d5' : '#fed7d7'
    },
    responseTitle: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: response?.success ? '#22543d' : '#742a2a',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    responseTime: {
      fontSize: '0.85rem',
      color: '#718096'
    },
    responseBody: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      marginTop: '12px'
    },
    responseItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      padding: '10px 0',
      borderBottom: '1px solid #e2e8f0',
      '&:last-child': {
        borderBottom: 'none'
      }
    },
    responseLabel: {
      fontWeight: '600',
      color: '#4a5568',
      fontSize: '0.9rem'
    },
    responseValue: {
      fontWeight: '600',
      color: response?.success ? '#38a169' : '#e53e3e',
      fontSize: '1rem',
      wordBreak: 'break-word'
    },
    pre: {
      backgroundColor: '#2d3748',
      color: '#e2e8f0',
      padding: '15px',
      borderRadius: '8px',
      overflowX: 'auto',
      fontSize: '0.85rem',
      lineHeight: '1.4',
      fontFamily: "'Fira Code', 'Courier New', monospace",
      marginTop: '12px',
      maxWidth: '100%'
    },
    required: {
      color: '#e53e3e',
      marginLeft: '4px'
    },
    infoText: {
      fontSize: '0.85rem',
      color: '#718096',
      marginTop: '6px',
      fontStyle: 'italic',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      lineHeight: '1.4'
    },
    inputIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#718096',
      fontSize: '1.1rem',
      zIndex: 1
    },
    calculationCard: {
      backgroundColor: '#f0f7ff',
      borderRadius: '10px',
      padding: '20px',
      marginTop: '20px',
      border: '2px solid #bee3f8'
    },
    calculationRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #e2e8f0',
      '&:last-child': {
        borderBottom: 'none'
      }
    },
    calculationLabel: {
      color: '#4a5568',
      fontWeight: '600',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    calculationValue: {
      fontWeight: '700',
      fontSize: '1.1rem'
    },
    positive: {
      color: '#38a169'
    },
    negative: {
      color: '#e53e3e'
    },
    summaryTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      marginBottom: '20px',
      color: '#2d3748',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    profitMargin: {
      textAlign: 'center',
      marginTop: '15px',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: calculation.netProfit >= 0 ? '#c6f6d5' : '#fed7d7',
      color: calculation.netProfit >= 0 ? '#22543d' : '#742a2a',
      fontWeight: '600',
      fontSize: '1.1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    sectionTitle: {
      fontSize: '1.2rem',
      fontWeight: '700',
      marginBottom: '15px',
      color: '#4a5568',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    icon: {
      fontSize: '1.3rem',
      display: 'flex',
      alignItems: 'center'
    },
    tipsCard: {
      marginTop: '25px',
      padding: '15px',
      backgroundColor: '#fef3c7',
      borderRadius: '10px',
      border: '2px solid #f59e0b'
    },
    tipsList: {
      color: '#92400e',
      fontSize: '0.85rem',
      lineHeight: '1.5',
      paddingLeft: '15px',
      margin: 0
    },
    tipsItem: {
      marginBottom: '6px',
      '&:last-child': {
        marginBottom: 0
      }
    },
    // Media Queries
    '@media (min-width: 768px)': {
      container: {
        padding: '20px'
      },
      header: {
        padding: '25px 20px',
        marginBottom: '30px'
      },
      mainGrid: {
        flexDirection: 'row',
        gap: '30px'
      },
      formCard: {
        flex: '2',
        order: 1,
        padding: '30px'
      },
      summaryCard: {
        flex: '1',
        minWidth: '320px',
        order: 2,
        padding: '25px'
      },
      buttonContainer: {
        flexDirection: 'row',
        gap: '20px'
      },
      submitButton: {
        width: 'auto',
        minWidth: '200px'
      },
      resetButton: {
        width: 'auto',
        minWidth: '150px'
      },
      responseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    },
    '@media (min-width: 1024px)': {
      container: {
        maxWidth: '1400px',
        padding: '30px'
      },
      header: {
        padding: '30px',
        marginBottom: '40px'
      },
      formCard: {
        padding: '40px'
      },
      summaryCard: {
        padding: '30px'
      }
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{
          fontSize: '14px',
          width: '90%',
          maxWidth: '400px'
        }}
      />

      <header style={styles.header}>
        <h1 style={styles.title}>
          <FiDollarSign size={30} />
          {t('financial_management')}
        </h1>
        <p style={styles.subtitle}>
          {t('track_revenue_expenses_financial_performance')}
        </p>
      </header>

      <div style={styles.mainGrid}>
        {/* Form Section */}
        <div style={styles.formCard}>
          <div style={{ ...styles.sectionTitle, marginBottom: '25px' }}>
            <span style={styles.icon}>📊</span>
            {t('financial_data_entry')}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              {/* Date Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FiCalendar size={16} />
                  {t('date')} <span style={styles.required}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <FiCalendar style={styles.inputIcon} />
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    dateFormat="MMM d, yyyy"
                    customInput={
                      <input
                        style={{
                          ...styles.input,
                          ...styles.datePicker,
                          ...(errors.date ? { borderColor: '#e53e3e' } : {})
                        }}
                      />
                    }
                  />
                </div>
                {errors.date && (
                  <span style={styles.errorText}>
                    <FiAlertCircle size={14} /> {errors.date}
                  </span>
                )}
              </div>

              {/* Revenue Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FiDollarSign size={16} />
                  {t('revenue_sar')} <span style={styles.required}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <FiDollarSign style={styles.inputIcon} />
                  <input
                    type="text"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleNumberChange}
                    style={{
                      ...styles.input,
                      ...(errors.revenue ? { borderColor: '#e53e3e' } : {})
                    }}
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </div>
                {errors.revenue && (
                  <span style={styles.errorText}>
                    <FiAlertCircle size={14} /> {errors.revenue}
                  </span>
                )}
                <p style={styles.infoText}>
                  <FiInfo size={14} /> {t('total_income')}
                </p>
              </div>

              {/* Expenses Section */}
              <div style={{ gridColumn: '1 / -1', marginTop: '15px' }}>
                <div style={{ ...styles.sectionTitle, marginBottom: '20px' }}>
                  <span style={styles.icon}>💰</span>
                  {t('expense_breakdown')}
                </div>

                <div style={styles.formGrid}>
                  {/* Buy Products */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <FiPackage size={16} /> {t('products')}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="buyProducts"
                        value={formData.buyProducts}
                        onChange={handleNumberChange}
                        style={{
                          ...styles.input,
                          ...(errors.buyProducts ? { borderColor: '#e53e3e' } : {})
                        }}
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                    </div>
                    {errors.buyProducts && (
                      <span style={styles.errorText}>
                        <FiAlertCircle size={14} /> {errors.buyProducts}
                      </span>
                    )}
                  </div>

                  {/* Transportation */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <FiTruck size={16} /> {t('transportation')}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="transportation"
                        value={formData.transportation}
                        onChange={handleNumberChange}
                        style={{
                          ...styles.input,
                          ...(errors.transportation ? { borderColor: '#e53e3e' } : {})
                        }}
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                    </div>
                    {errors.transportation && (
                      <span style={styles.errorText}>
                        <FiAlertCircle size={14} /> {errors.transportation}
                      </span>
                    )}
                  </div>

                  {/* Repairs */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <FiTool size={16} /> {t('repairs')}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="repairs"
                        value={formData.repairs}
                        onChange={handleNumberChange}
                        style={{
                          ...styles.input,
                          ...(errors.repairs ? { borderColor: '#e53e3e' } : {})
                        }}
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                    </div>
                    {errors.repairs && (
                      <span style={styles.errorText}>
                        <FiAlertCircle size={14} /> {errors.repairs}
                      </span>
                    )}
                  </div>

                  {/* Technology */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <FiCpu size={16} /> {t('technology')}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="technology"
                        value={formData.technology}
                        onChange={handleNumberChange}
                        style={{
                          ...styles.input,
                          ...(errors.technology ? { borderColor: '#e53e3e' } : {})
                        }}
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                    </div>
                    {errors.technology && (
                      <span style={styles.errorText}>
                        <FiAlertCircle size={14} /> {errors.technology}
                      </span>
                    )}
                  </div>

                  {/* Account */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <FiCreditCard size={16} /> {t('account')}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="account"
                        value={formData.account}
                        onChange={handleNumberChange}
                        style={{
                          ...styles.input,
                          ...(errors.account ? { borderColor: '#e53e3e' } : {})
                        }}
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                    </div>
                    {errors.account && (
                      <span style={styles.errorText}>
                        <FiAlertCircle size={14} />
                        {errors.account}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes Field */}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <FiFileText size={16} /> {t('notes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder={t('add_any_additional_notes')}
                    rows="3"
                  />
                  <p style={styles.infoText}>
                    <FiInfo size={14} /> {t('optional_notes')}
                  </p>
                </div>
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <button
                type="submit"
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Grid color="#ffffff" size={10} />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    {t('save_record')}
                  </>
                )}
              </button>

              <button
                type="button"
                style={styles.resetButton}
                onClick={() => {
                  setFormData({
                    date: new Date(),
                    revenue: '',
                    expense: '',
                    buyProducts: '',
                    transportation: '',
                    repairs: '',
                    technology: '',
                    account: '',
                    notes: ''
                  });
                  setErrors({});
                  setResponse(null);
                  toast.info(t('form_cleared'));
                }}
              >
                <FiRefreshCw size={18} />
                {t('clear_form')}
              </button>
            </div>
          </form>

          {loading && (
            <div style={styles.loadingContainer}>
              <Grid color="#667eea" size={20} />
              <p style={{ marginTop: '15px', color: '#718096', fontSize: '1rem' }}>
                {t('saving_financial_data')}
              </p>
            </div>
          )}

          {/* Response Display */}
          {response && !loading && (
            <div style={styles.responseCard}>
              <div style={styles.responseHeader}>
                <div style={styles.responseTitle}>
                  {response.success ? (
                    <>
                      {t('success')}
                    </>
                  ) : (
                    <>
                      {t('error')}
                    </>
                  )}
                </div>
                <div style={styles.responseTime}>
                  {formatDate(response.timestamp)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>
            {t('summary')}
          </h3>

          <div style={styles.calculationCard}>
            <div style={styles.calculationRow}>
              <span style={styles.calculationLabel}>
                <FiDollarSign size={16} /> {t('revenue')}:
              </span>
              <span style={{ ...styles.calculationValue, ...styles.positive }}>
                {formatCurrency(parseFloat(formData.revenue) || 0)}
              </span>
            </div>

            <div style={styles.calculationRow}>
              <span style={styles.calculationLabel}>
                <FiTool size={16} /> {t('expenses')}:
              </span>
              <span style={{ ...styles.calculationValue, ...styles.negative }}>
                {formatCurrency(calculation.totalExpenses)}
              </span>
            </div>

            <div style={styles.calculationRow}>
              <span style={styles.calculationLabel}>
                <FiCheckCircle size={16} /> {t('profit')}:
              </span>
              <span style={{
                ...styles.calculationValue,
                ...(calculation.netProfit >= 0 ? styles.positive : styles.negative)
              }}>
                {formatCurrency(calculation.netProfit)}
              </span>
            </div>

            <div style={styles.profitMargin}>
              <FiInfo size={16} />
              {t('margin')}: {calculation.profitMargin}%
            </div>
          </div>

          <div style={{ marginTop: '25px' }}>
            <div style={{ ...styles.sectionTitle, marginBottom: '12px' }}>
              <span style={styles.icon}>📋</span>
              {t('expense_details')}
            </div>

            <div style={styles.calculationCard}>
              <div style={styles.calculationRow}>
                <span style={styles.calculationLabel}>
                  <FiPackage size={14} /> {t('products')}:
                </span>
                <span style={styles.calculationValue}>
                  {formatCurrency(parseFloat(formData.buyProducts) || 0)}
                </span>
              </div>

              <div style={styles.calculationRow}>
                <span style={styles.calculationLabel}>
                  <FiTruck size={14} /> {t('transport')}:
                </span>
                <span style={styles.calculationValue}>
                  {formatCurrency(parseFloat(formData.transportation) || 0)}
                </span>
              </div>

              <div style={styles.calculationRow}>
                <span style={styles.calculationLabel}>
                  <FiTool size={14} /> {t('repairs')}:
                </span>
                <span style={styles.calculationValue}>
                  {formatCurrency(parseFloat(formData.repairs) || 0)}
                </span>
              </div>

              <div style={styles.calculationRow}>
                <span style={styles.calculationLabel}>
                  <FiCpu size={14} /> {t('tech')}:
                </span>
                <span style={styles.calculationValue}>
                  {formatCurrency(parseFloat(formData.technology) || 0)}
                </span>
              </div>

              <div style={styles.calculationRow}>
                <span style={styles.calculationLabel}>
                  <FiCreditCard size={14} /> {t('account')}:
                </span>
                <span style={styles.calculationValue}>
                  {formatCurrency(parseFloat(formData.account) || 0)}
                </span>
              </div>
            </div>
          </div>

          <div style={styles.tipsCard}>
            <div style={{ ...styles.sectionTitle, color: '#92400e', marginBottom: '8px', fontSize: '1rem' }}>
              <span style={styles.icon}>💡</span>
              {t('tips')}
            </div>
            <ul style={styles.tipsList}>
              <li style={styles.tipsItem}>{t('expenses_auto_calculated')}</li>
              <li style={styles.tipsItem}>{t('currency_in_sar')}</li>
              <li style={styles.tipsItem}>{t('profit_margin_shown_as_percent')}</li>
              <li style={styles.tipsItem}>{t('date_defaults_to_today')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagementForm;