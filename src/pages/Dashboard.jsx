import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Store, Truck, CheckCircle, XCircle, Wallet, AlertCircle, Info} from 'lucide-react';
import { marketplaceService } from '../web3/marketplace';
import { dummyMarketProducts, dummyMyListings, dummyMyPurchases } from '../constant/productData';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { TabsList, TabsTrigger, TabsContent, TabsContainer } from '../components/Tabs';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../components/Dialog';
import logo from '../assets/Aurora.png';
import walletLogo from '../assets/Metamask.png'

const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const requestMetaMaskSignature = async (message) => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed!");
    }

    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    const account = accounts[0];

    const msgParams = JSON.stringify({
      domain: {
        name: 'Aurora Marketplace',
        version: '1',
        chainId: await window.ethereum.request({ method: 'eth_chainId' }),
      },
      message: {
        action: message.action,
        details: message.details,
        timestamp: new Date().toISOString()
      },
      primaryType: 'Transaction',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' }
        ],
        Transaction: [
          { name: 'action', type: 'string' },
          { name: 'details', type: 'string' },
          { name: 'timestamp', type: 'string' }
        ]
      }
    });

    const signature = await window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [account, msgParams],
    });

    return signature;
  } catch (error) {
    console.error('Error in signature request:', error);
    throw error;
  }
};

const WalletDialog = ({ isOpen, onClose, onConnect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
        <p className="text-gray-600 mb-6">Connect your wallet to access the marketplace features.</p>
        <div className="space-y-3">
          <button
            onClick={() => {
              onConnect();
              onClose();
            }}
            className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <img src={walletLogo}
              alt="MetaMask" className="w-8 h-8" />
              <span className="font-medium">MetaMask</span>
            </div>
            <span className="text-gray-400">Popular</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const STATUS = {
    AVAILABLE: 'AVAILABLE',
    PENDING_SHIPPING: 'PENDING_SHIPPING',
    SHIPPED: 'SHIPPED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    SOLD: 'SOLD'
  };

  const connectWallet = async () => {
    try {
      const account = await marketplaceService.connectWallet();
      setConnectedAccount(account);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setConnectedAccount(null);
  };

  const [notification, setNotification] = useState({
    message: '',
    type: 'info',
    isVisible: false
  });

  const CustomNotification = ({ message, type = 'info', onClose }) => {
    const types = {
      success: {
        icon: CheckCircle,
        className: 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200',
        textColor: 'text-emerald-800',
        iconColor: 'text-emerald-600'
      },
      error: {
        icon: XCircle,
        className: 'bg-gradient-to-r from-red-50 to-red-100 border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
      },
      warning: {
        icon: AlertCircle,
        className: 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600'
      },
      info: {
        icon: Info,
        className: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
      }
    };
  
    const Icon = types[type].icon;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="animate-in fade-in zoom-in duration-300">
          <div className={`rounded-xl shadow-2xl overflow-hidden w-[320px] ${types[type].className}`}>
            <div className="bg-emerald-800 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img 
                  src={logo} 
                  alt="Aurora Logo" 
                  className="h-6 w-auto"
                />
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-full ${types[type].className} ${types[type].iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`font-medium capitalize ${types[type].textColor}`}>
                  {type}
                </span>
              </div>
              <p className={`text-sm ${types[type].textColor}`}>
                {message}
              </p>
            </div>
            <div className="relative h-1 bg-gray-200">
              <div 
                className="absolute inset-0 bg-emerald-600 animate-shrink-width"
                style={{
                  animation: 'shrink 5s linear forwards'
                }}
              />
            </div>
          </div>
        </div>
  
        <style jsx>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
          .animate-shrink-width {
            animation: shrink 5s linear forwards;
          }
        `}</style>
      </div>
    );
  };

  const showNotification = (message, type = 'info') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (!file.type.includes('image/')) {
        throw new Error('Please upload an image file');
      }
    
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }
   
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Image upload error:', error);
      setError(error.message);

      setProductForm(prev => ({
        ...prev,
        image: null,
        imagePreview: null
      }));

      setTimeout(() => setError(null), 3000);
    }
  };

  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marketProducts, setMarketProducts] = useState(dummyMarketProducts || []);
  const [myListings, setMyListings] = useState(dummyMyListings || []);
  const [myPurchases, setMyPurchases] = useState(dummyMyPurchases || []);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    imagePreview: null
  });

  const [shippingForm, setShippingForm] = useState({
    recipientName: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: '',
    courierService: '',
    packageWeight: '',
    specialInstructions: ''
  });

  const generateTrackingNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const middleSegment = Math.floor(100000 + Math.random() * 900000).toString();
    
    let lastSegment = '';
    for (let i = 0; i < 3; i++) {
      lastSegment += chars[Math.floor(Math.random() * chars.length)];
    }
  
    return `ALY-${middleSegment}-${lastSegment}`;
  };

  const cancelListing = async (productId) => {
    try {
      setIsLoading(true);
      
      const product = myListings.find(p => p.id === productId);
      if (!product) {
        throw new Error("Product not found");
      }

      await requestMetaMaskSignature({
        action: 'CANCEL_LISTING',
        details: `Cancel listing for ${product.name}`
      });

      setMyListings(prevListings =>
        prevListings.map(product =>
          product.id === productId
            ? {
                ...product,
                status: STATUS.CANCELLED
              }
            : product
        )
      );

      setMarketProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId
            ? {
                ...product,
                status: STATUS.CANCELLED
              }
            : product
        )
      );

      setMyPurchases(prevPurchases =>
        prevPurchases.map(product =>
          product.id === productId
            ? {
                ...product,
                status: STATUS.CANCELLED
              }
            : product
        )
      );
  
      showNotification("Listing cancelled successfully!", "success");
    } catch (error) {
      console.error("Failed to cancel listing:", error);
      setError(error.message || "Failed to cancel listing");
      showNotification(error.message || "Failed to cancel listing", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchDummyData = async () => {
      try {
        if (dummyMarketProducts) {
          setMarketProducts(dummyMarketProducts);
        }
      } catch (error) {
        console.error("Failed to fetch dummy data:", error);
        setMarketProducts([]);
      }
    };

    fetchDummyData();
  }, []);

  const handleShippingSubmit = async (productId) => {
    try {
      setIsLoading(true);
      const product = myListings.find(p => p.id === productId);
      if (!product) {
        throw new Error("Product not found");
      }
  
      const trackingId = generateTrackingNumber(shippingForm);
  
      await requestMetaMaskSignature({
        action: 'UPDATE_SHIPPING',
        details: `Ship ${product.name} to ${product.buyer} with tracking ${trackingId}`
      });

      const updatedProduct = {
        ...product,
        status: STATUS.SHIPPED,
        trackingNumber: trackingId,
        shippingDetails: {
          ...shippingForm,
          trackingNumber: trackingId,
          shippedAt: new Date().toISOString()
        }
      };
  
      setMyListings(prevListings =>
        prevListings.map(item =>
          item.id === productId ? updatedProduct : item
        )
      );
      
      setMarketProducts(prevProducts =>
        prevProducts.map(item =>
          item.id === productId ? updatedProduct : item
        )
      );
      
      setMyPurchases(prevPurchases => {
        const exists = prevPurchases.some(purchase => purchase.id === productId);
        
        if (exists) {

          return prevPurchases.map(purchase =>
            purchase.id === productId ? updatedProduct : purchase
          );
        } else {

          return [...prevPurchases, updatedProduct];
        }
      });

      setShippingForm({
        recipientName: '',
        phoneNumber: '',
        address: '',
        city: '',
        postalCode: '',
        courierService: '',
        packageWeight: '',
        specialInstructions: ''
      });
  
      showNotification("Shipping details updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update shipping status:", error);
      setError(error.message || "Failed to update shipping status");
      showNotification(error.message || "Failed to update shipping status", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmReceipt = async (productId) => {
    try {
      setIsLoading(true);
      
      const product = myPurchases.find(p => p.id === productId);
      if (!product) {
        throw new Error("Product not found");
      }
 
      await requestMetaMaskSignature({
        action: 'CONFIRM_RECEIPT',
        details: `Confirm receipt of ${product.name} from ${product.seller}`
      });
  
      setMyPurchases(prevPurchases =>
        prevPurchases.map(product =>
          product.id === productId
            ? {
                ...product,
                status: STATUS.COMPLETED
              }
            : product
        )
      );
      
      setMarketProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId
            ? {
                ...product,
                status: STATUS.COMPLETED
              }
            : product
        )
      );
  
      setMyListings(prevListings =>
        prevListings.map(product =>
          product.id === productId
            ? {
                ...product,
                status: STATUS.COMPLETED
              }
            : product
        )
      );
  
      showNotification("Receipt confirmed successfully!", "success");
    } catch (error) {
      console.error("Failed to confirm receipt:", error);
      setError(error.message || "Failed to confirm receipt");
      showNotification(error.message || "Failed to confirm receipt", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const listProduct = async (e) => {
    e.preventDefault();
    if (!connectedAccount) {
      showNotification("Please connect your wallet first", "error");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      await requestMetaMaskSignature({
        action: 'LIST_PRODUCT',
        details: `List ${productForm.name} for ${productForm.price} ETH`
      });
  
      let imageUrl = "/api/placeholder/200/200";
  
      if (productForm.image) {
        try {
          const formData = new FormData();
          formData.append('file', productForm.image);
          imageUrl = "/api/placeholder/200/200";
        } catch (imageError) {
          console.error("Failed to upload image:", imageError);
          throw new Error("Failed to upload image. Please try again.");
        }
      }
  
      const newProduct = {
        id: Date.now(),
        name: productForm.name,
        description: productForm.description,
        price: productForm.price,
        image: imageUrl,
        seller: connectedAccount,
        buyer: null,
        status: STATUS.AVAILABLE,
        trackingNumber: "",
        createdAt: new Date().toISOString().split('T')[0]
      };
  
      setMyListings(prevListings => [newProduct, ...prevListings]);
      setMarketProducts(prevProducts => [newProduct, ...prevProducts]);
  
      setProductForm({
        name: '',
        description: '',
        price: '',
        image: null,
        imagePreview: null
      });
  
      showNotification("Product listed successfully!", "success");
  
    } catch (err) {
      console.error("Error listing product:", err);
      setError(err.message || "Failed to list product");
      showNotification(err.message || "Failed to list product", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseProduct = async (productId, price) => {
    if (!connectedAccount) {
      showNotification("Please connect your wallet first", "error");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const product = marketProducts.find(p => p.id === productId);
  
      if (!product) {
        throw new Error("Product not found");
      }
  
      if (product.status !== STATUS.AVAILABLE) {
        throw new Error("Product is not available for purchase");
      }
  
      if (product.seller.toLowerCase() === connectedAccount.toLowerCase()) {
        throw new Error("You cannot buy your own product");
      }

      if (!product.seller || !product.seller.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error("Invalid seller address");
      }

      const priceInWei = `0x${(Number(price) * 1e18).toString(16)}`;
      const contractAddress = "0x434c5f151ab7241549e7bad70b2f8dbe3328b7ab";
  
      const transactionRequest = {
        from: connectedAccount,
        to: contractAddress,
        value: priceInWei,
        gas: '0x55555',
        data: '0x',
      };
  
      console.log('Transaction Request:', transactionRequest);

      const transaction = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionRequest],
      });
  
      const receipt = await window.ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [transaction],
      });
  
      if (!receipt || receipt.status === '0x0') {
        throw new Error('Transaction failed');
      }
  
      const updatedProduct = {
        ...product,
        status: STATUS.PENDING_SHIPPING,
        buyer: connectedAccount,
        transactionHash: transaction
      };
  
      setMarketProducts(prevProducts =>
        prevProducts.map(prod =>
          prod.id === productId 
            ? { ...updatedProduct, status: STATUS.SOLD }
            : prod
        )
      );
  
      setMyPurchases(prevPurchases => [updatedProduct, ...prevPurchases]);
  
      setMyListings(prevListings => {
        const exists = prevListings.some(listing => listing.id === productId);
        
        if (exists) {
          return prevListings.map(listing =>
            listing.id === productId ? updatedProduct : listing
          );
        } else {
          return [updatedProduct, ...prevListings];
        }
      });
  
      showNotification(
        "Purchase successful! Please wait for the seller to ship the item.", 
        "success"
      );
  
    } catch (err) {
      console.error("Error purchasing product:", err);
      if (err.code === 4001) {
        setError("Transaction was rejected");
        showNotification("Transaction was rejected", "error");
      } else {
        setError(err.message || "Failed to purchase product");
        showNotification(err.message || "Failed to purchase product", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderListingActions = (product) => {
    if (product.status === STATUS.PENDING_SHIPPING) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-yellow-600">
            Awaiting shipment to buyer: {product.buyer}
          </p>
          <div className="flex space-x-2">
            <ShippingDetailsForm productId={product.id} />
            <Button 
              className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700"
              onClick={() => cancelListing(product.id)}
            >
              <XCircle className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
          </div>
        </div>
      );
    }
  
    if (product.status === STATUS.SHIPPED) {
      return (
        <div className="p-2 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            Tracking Number: {product.trackingNumber}
          </p>
          <p className="text-sm text-blue-600">
            Waiting for buyer confirmation
          </p>
        </div>
      );
    }
  
    if (product.status === STATUS.COMPLETED) {
      return (
        <div className="p-2 bg-purple-50 rounded-md flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 text-purple-800" />
          <p className="text-sm text-purple-800">
            Transaction Completed
          </p>
        </div>
      );
    }

    if (product.status === STATUS.CANCELLED) {
      return (
        <div className="p-2 bg-red-50 rounded-md flex items-center">
          <XCircle className="h-4 w-4 mr-2 text-red-800" />
          <p className="text-sm text-red-800">
            Product Cancelled
          </p>
        </div>
      );
    }
  
    if (product.status === STATUS.AVAILABLE) {
      return (
        <Button 
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700"
          onClick={() => cancelListing(product.id)}
        >
          <XCircle className="h-4 w-4" />
          <span>Cancel Listing</span>
        </Button>
      );
    }

    return null;
  };

  const getStatusBadge = (status) => {
    const styles = {
      [STATUS.AVAILABLE]: "bg-emerald-100 text-emerald-800",
      [STATUS.PENDING_SHIPPING]: "bg-yellow-100 text-yellow-800",
      [STATUS.SHIPPED]: "bg-blue-100 text-blue-800",
      [STATUS.COMPLETED]: "bg-purple-100 text-purple-800",
      [STATUS.CANCELLED]: "bg-red-100 text-red-800",
      [STATUS.SOLD]: "bg-red-100 text-red-800"
    };

    const displayText = {
      [STATUS.AVAILABLE]: "AVAILABLE",
      [STATUS.PENDING_SHIPPING]: "PENDING SHIPPING",
      [STATUS.SHIPPED]: "SHIPPED",
      [STATUS.COMPLETED]: "COMPLETED",
      [STATUS.CANCELLED]: "CANCELLED",
      [STATUS.SOLD]: "SOLD"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || ''}`}>
        {displayText[status]}
      </span>
    );
  };

  const ShippingDetailsForm = ({ productId }) => {
    const [localShippingForm, setLocalShippingForm] = useState({
      recipientName: '',
      phoneNumber: '',
      address: '',
      city: '',
      postalCode: '',
      courierService: '',
      packageWeight: '',
      specialInstructions: ''
    });
  
    const handleSubmit = async () => {
      await handleShippingSubmit(productId);
      setLocalShippingForm({
        recipientName: '',
        phoneNumber: '',
        address: '',
        city: '',
        postalCode: '',
        courierService: '',
        packageWeight: '',
        specialInstructions: ''
      });
    };
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full flex items-center justify-center space-x-2 text-white py-2 rounded-lg">
            <Truck className="h-4 w-4" />
            <span>Generate Tracking Number</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Shipping Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Recipient Name"
                value={localShippingForm.recipientName}
                onChange={(e) => setLocalShippingForm(prev => ({
                  ...prev,
                  recipientName: e.target.value
                }))}
                className="col-span-2"
              />
              <Input
                placeholder="Phone Number"
                value={localShippingForm.phoneNumber}
                onChange={(e) => setLocalShippingForm(prev => ({
                  ...prev,
                  phoneNumber: e.target.value
                }))}
              />
              <Input
                placeholder="Postal Code"
                value={localShippingForm.postalCode}
                onChange={(e) => setLocalShippingForm(prev => ({
                  ...prev,
                  postalCode: e.target.value
                }))}
              />
            </div>
            
            <Textarea
              placeholder="Delivery Address"
              value={localShippingForm.address}
              onChange={(e) => setLocalShippingForm(prev => ({
                ...prev,
                address: e.target.value
              }))}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="City"
                value={localShippingForm.city}
                onChange={(e) => setLocalShippingForm(prev => ({
                  ...prev,
                  city: e.target.value
                }))}
              />
              <Input
                placeholder="Courier Service"
                value={localShippingForm.courierService}
                onChange={(e) => setLocalShippingForm(prev => ({
                  ...prev,
                  courierService: e.target.value
                }))}
              />
            </div>
            
            <Input
              type="number"
              placeholder="Package Weight (kg)"
              value={localShippingForm.packageWeight}
              onChange={(e) => setLocalShippingForm(prev => ({
                ...prev,
                packageWeight: e.target.value
              }))}
            />
            
            <Textarea
              placeholder="Special Instructions (Optional)"
              value={localShippingForm.specialInstructions}
              onChange={(e) => setLocalShippingForm(prev => ({
                ...prev,
                specialInstructions: e.target.value
              }))}
            />
            
            <Button 
              className="w-full bg-emerald-800 hover:bg-emerald-700"
              onClick={handleSubmit}
            >
              Generate & Submit Tracking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-emerald-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src={logo}
                alt="Aurora Logo" 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              {connectedAccount && (
                <div className="bg-emerald-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {truncateAddress(connectedAccount)}
                  </span>
                </div>
              )}
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-emerald-700"
                onClick={() => connectedAccount ? disconnectWallet() : setIsWalletDialogOpen(true)}
              >
                {connectedAccount ? 'Disconnect' : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <WalletDialog
        isOpen={isWalletDialogOpen}
        onClose={() => setIsWalletDialogOpen(false)}
        onConnect={connectWallet}
      />

      <main className="container mx-auto px-4 py-8">
        <TabsContainer defaultValue="market">
          <TabsList className="mb-4">
            <TabsTrigger value="market" className="min-w-[140px] justify-center">
              <ShoppingCart className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Marketplace</span>
            </TabsTrigger>
            <TabsTrigger value="selling" className="min-w-[140px] justify-center">
              <Store className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">My Listings</span>
            </TabsTrigger>
            <TabsTrigger value="purchases" className="min-w-[140px] justify-center">
              <Package className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">My Purchases</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="market">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketProducts.map(product => (
                <Card key={product.id}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      {getStatusBadge(product.status)}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <p className="text-lg font-bold text-emerald-800 mb-4">{product.price} ETH</p>
                    <Button 
                      className="w-full bg-emerald-800 hover:bg-emerald-700"
                      onClick={() => purchaseProduct(product.id, product.price)}
                      disabled={isLoading || product.status !== STATUS.AVAILABLE}
                    >
                      {isLoading ? "Processing..." : "Buy Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="selling">
            <div className="space-y-8">
              <Card className="mb-8">
                <CardHeader>
                  <h2 className="text-xl font-bold text-emerald-800">List New Product</h2>
                </CardHeader>
                <CardContent>
                  <form onSubmit={listProduct} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer block text-center"
                      >
                        {productForm.imagePreview ? (
                          <div className="relative w-full aspect-video">
                            <img
                              src={productForm.imagePreview}
                              alt="Preview"
                              className="rounded-lg object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                              <p className="text-white">Change Image</p>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <div className="text-gray-500">
                              <p>Click to upload product image</p>
                              <p className="text-sm">(Max size: 5MB)</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <p className="text-sm">{error}</p>
                      </div>
                    )}
                    
                    <Input 
                      placeholder="Product Name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      disabled={isLoading}
                      required
                    />
                    <Textarea 
                      placeholder="Description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      disabled={isLoading}
                      required
                    />
                    <Input 
                      type="number"
                      step="0.001"
                      placeholder="Price (ETH)"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      disabled={isLoading}
                      required
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-800 hover:bg-emerald-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "List Product"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map(product => (
                  <Card key={product.id}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        {getStatusBadge(product.status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      <p className="text-lg font-bold text-emerald-800 mb-2">{product.price} ETH</p>

                      {renderListingActions(product)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="purchases">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPurchases.map(product => (
                <Card key={product.id}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      {getStatusBadge(product.status)}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <p className="text-sm text-gray-500 mb-2">Seller: {product.seller}</p>
                    <p className="text-lg font-bold text-emerald-800 mb-4">{product.price} ETH</p>

                    {product.status === STATUS.PENDING_SHIPPING && (
                      <div className="p-2 bg-yellow-50 rounded-md">
                        <p className="text-sm text-yellow-800">
                          Waiting for seller to ship
                        </p>
                      </div>
                    )}

                    {product.status === STATUS.SHIPPED && (
                      <div className="space-y-2">
                        <div className="p-2 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-800">
                            Tracking Number: {product.trackingNumber}
                          </p>
                        </div>
                        <Button 
                          onClick={() => confirmReceipt(product.id)}
                          className="w-full"
                        >
                          Confirm Receipt
                        </Button>
                      </div>
                    )}

                    {product.status === STATUS.COMPLETED && (
                      <div className="p-2 bg-purple-50 rounded-md flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-purple-800" />
                        <p className="text-sm text-purple-800">
                          Transaction Completed
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </TabsContainer>
      </main>
      {notification.isVisible && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        />
      )}
    </div>
  );
};

export default Dashboard;