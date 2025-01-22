// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AuroraMarketplace {
    enum ProductStatus { Available, PendingShipping, Shipped, Completed, Cancelled }
    /**
    Define status untuk produk di marketplace:
    - Available: Produk terdaftar dan dapat dibeli
    - PendingShipping: Produk telah dibeli dan menunggu pengiriman dari penjual
    - Shipped: Produk telah dikirim dengan nomor resi/pengiriman
    - Completed: Pembeli telah mengkonfirmasi penerimaan produk
    - Cancelled: Penjual telah membatalkan transaksi
    */
    struct Product {
        uint256 id; // Id untuk produk
        string name; // Nama produk
        string description; // Deskripsi detail produk
        uint256 price; // Harga dalam wei
        string imageUrl; // URL gambar produk yang disimpan di IPFS
        address payable seller; // Address penjual
        address buyer; // Alamat pembeli
        ProductStatus status; // Status terkini produk
        string trackingNumber; // Nomor resi pengiriman
        uint256 createdAt; // Timestamp ketika produk didaftarkan
    }

    mapping(uint256 => Product) public products; // Mapping ID produk ke struct Product dan menyimpan semua produk yang terdaftar di marketplace
    uint256 public productCount; // Count untuk menghasilkan ID produk dan bertambah setiap ada produk baru
    
    event ProductListed(uint256 indexed id, string name, uint256 price, address seller);
    event ProductPurchased(uint256 indexed id, address buyer);
    event TrackingUpdated(uint256 indexed id, string trackingNumber);
    event ProductCompleted(uint256 indexed id);
    event ProductCancelled(uint256 indexed id);
    // Event yang ada selama berbagai operation marketplace

    // Modifier untuk membatasi akses function hanya untuk penjual produk dan param _productId ID produk
    modifier onlyProductSeller(uint256 _productId) {
        require(products[_productId].seller == msg.sender, "Only seller can perform this action");
        _;
    }

    // Modifier untuk membatasi akses function hanya untuk pembeli produk dan param _productId ID produk
    modifier onlyProductBuyer(uint256 _productId) {
        require(products[_productId].buyer == msg.sender, "Only buyer can perform this action");
        _;
    }

    function listProduct(string memory _name, string memory _description, uint256 _price, string memory _imageUrl) public returns (uint256) {
        require(_price > 0, "Price must be greater than 0");
        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: _name,
            description: _description,
            price: _price,
            imageUrl: _imageUrl,
            seller: payable(msg.sender),
            buyer: address(0),
            status: ProductStatus.Available,
            trackingNumber: "",
            createdAt: block.timestamp
        });
        
        emit ProductListed(productCount, _name, _price, msg.sender);
        return productCount;
        /**
        Mendaftarkan produk baru di marketplace
        _name => Nama produk
        _description => Deskripsi produk
        _price => Harga produk dalam wei
        _imageUrl => URL IPFS untuk gambar produk
        return uint256 => ID dari produk yang baru didaftarkan
        */
    }

    function purchaseProduct(uint256 _productId) public payable {
        Product storage product = products[_productId];
        require(product.id != 0, "Product does not exist");
        require(product.status == ProductStatus.Available, "Product is not available");
        require(msg.value == product.price, "Incorrect payment amount");
        require(msg.sender != product.seller, "Seller cannot buy their own product");
        product.buyer = msg.sender;
        product.status = ProductStatus.PendingShipping;
        
        emit ProductPurchased(_productId, msg.sender);
        /**
        Pembelian produk yang tersedia
        _productId ID produk yang akan dibeli
        Persyaratan:
        - Produk harus ada dan tersedia
        - ETH yang dikirim harus sesuai dengan harga produk
        - Pembeli tidak boleh penjual barang itu sendiri
        */
    }

    function updateTracking(uint256 _productId, string memory _trackingNumber) public onlyProductSeller(_productId) {
        Product storage product = products[_productId];
        require(product.status == ProductStatus.PendingShipping, "Product is not pending shipping");
        product.trackingNumber = _trackingNumber;
        product.status = ProductStatus.Shipped;

        emit TrackingUpdated(_productId, _trackingNumber);
        /**
        Penjual memperbarui nomor resi pengiriman
        _productId ID produk
        _trackingNumber Nomor resi pengiriman
        Persyaratan:
        - Hanya penjual yang dapat memperbarui
        - Produk harus dalam status PendingShipping
        */
    }

    function confirmReceipt(uint256 _productId) public onlyProductBuyer(_productId) {
        Product storage product = products[_productId];
        require(product.status == ProductStatus.Shipped, "Product is not shipped");

        product.status = ProductStatus.Completed;
        product.seller.transfer(product.price);

        emit ProductCompleted(_productId);
        /**
        Pembeli mengkonfirmasi penerimaan produk
        _productId ID produk
        Persyaratan:
        - Hanya pembeli yang dapat mengkonfirmasi
        - Produk harus dalam status Shipped
        Efek:
        - Mentransfer pembayaran ke penjual
        - Memperbarui status menjadi Completed
        */
    }

    function cancelProduct(uint256 _productId) public onlyProductSeller(_productId) {
        Product storage product = products[_productId];
        require(product.status == ProductStatus.Available, "Can only cancel available products");

        product.status = ProductStatus.Cancelled;
        emit ProductCancelled(_productId);
        /**
        Penjual membatalkan list produk yang tersedia
        _productId ID produk yang akan dibatalkan
        Persyaratan:
        - Hanya penjual yang dapat membatalkan
        - Produk harus dalam status Available
        */
    }

    function getProduct(uint256 _productId) public view returns (
        uint256 id,
        string memory name,
        string memory description,
        uint256 price,
        address seller,
        address buyer,
        ProductStatus status,
        string memory trackingNumber,
        uint256 createdAt
    ) {
        Product memory product = products[_productId];
        return (
            product.id,
            product.name,
            product.description,
            product.price,
            product.seller,
            product.buyer,
            product.status,
            product.trackingNumber,
            product.createdAt
        );
    }
    /**
    Mengambil informasi lengkap tentang produk
    _productId ID produk
    Informasi produk lengkap termasuk semua field struct
    */
}