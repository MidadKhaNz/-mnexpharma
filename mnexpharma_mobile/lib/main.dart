import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const MnexPharmaApp());
}

class MnexPharmaApp extends StatelessWidget {
  const MnexPharmaApp({super.key});

  @override
  Widget build(BuildContext context) {
    const brand = Color(0xFF0F8F83);
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'MNEX Pharma',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: brand,
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF6F8FB),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: Color(0xFFE1E7EF)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: Color(0xFFE1E7EF)),
          ),
        ),
      ),
      home: const AuthGate(),
    );
  }
}

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  final api = ApiClient();
  bool loading = true;
  User? user;

  @override
  void initState() {
    super.initState();
    _restore();
  }

  Future<void> _restore() async {
    await api.restore();
    if (api.hasToken) {
      try {
        user = await api.me();
      } catch (_) {
        await api.logoutLocal();
      }
    }
    if (mounted) setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    if (user == null) {
      return LoginScreen(
        api: api,
        onSignedIn: (nextUser) => setState(() => user = nextUser),
      );
    }
    return HomeShell(
      api: api,
      user: user!,
      onLogout: () async {
        await api.logout();
        if (mounted) setState(() => user = null);
      },
    );
  }
}

class ApiClient {
  static String get baseUrl {
    const override = String.fromEnvironment('API_BASE_URL');
    if (override.isNotEmpty) return override;
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:3001/api';
    }
    return 'http://127.0.0.1:3001/api';
  }

  String? _token;
  bool get hasToken => _token != null && _token!.isNotEmpty;

  Future<void> restore() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('mnex_token');
  }

  Future<void> _saveToken(String token) async {
    _token = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('mnex_token', token);
  }

  Future<void> logoutLocal() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('mnex_token');
  }

  Future<void> logout() async {
    try {
      await post('/auth/logout', {});
    } finally {
      await logoutLocal();
    }
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (hasToken) 'Authorization': 'Bearer $_token',
  };

  Future<dynamic> get(String path) async {
    final response = await http.get(
      Uri.parse('$baseUrl$path'),
      headers: _headers,
    );
    return _decode(response);
  }

  Future<dynamic> post(String path, Map<String, dynamic> body) async {
    final response = await http.post(
      Uri.parse('$baseUrl$path'),
      headers: _headers,
      body: jsonEncode(body),
    );
    return _decode(response);
  }

  Future<dynamic> patch(String path, Map<String, dynamic> body) async {
    final response = await http.patch(
      Uri.parse('$baseUrl$path'),
      headers: _headers,
      body: jsonEncode(body),
    );
    return _decode(response);
  }

  dynamic _decode(http.Response response) {
    final body = response.body.isEmpty
        ? <String, dynamic>{}
        : jsonDecode(response.body);
    if (response.statusCode >= 400) {
      final error = body is Map ? body['error'] : null;
      throw ApiException(error?.toString() ?? 'Request failed.');
    }
    return body is Map && body.containsKey('data') ? body['data'] : body;
  }

  Future<User> login(String email, String password) async {
    final data = await post('/auth/login', {
      'email': email,
      'password': password,
    });
    await _saveToken(text(data['token']));
    return User.fromJson(asMap(data['user']));
  }

  Future<User> me() async => User.fromJson(asMap(await get('/auth/me')));
  Future<Map<String, dynamic>> dashboard() async =>
      asMap(await get('/dashboard'));
  Future<Map<String, dynamic>> reports() async => asMap(await get('/reports'));
  Future<Map<String, dynamic>> purchasesSummary() async =>
      asMap(await get('/purchases-summary'));
  Future<List<Map<String, dynamic>>> catalog() async =>
      asList(await get('/catalog'));
  Future<List<Map<String, dynamic>>> customerOrders(String phone) async =>
      asList(await get('/orders/customer?phone=${Uri.encodeComponent(phone)}'));
  Future<List<Map<String, dynamic>>> medicines() async =>
      asList(await get('/medicines'));
  Future<List<Map<String, dynamic>>> customers() async =>
      asList(await get('/customers'));
  Future<List<Map<String, dynamic>>> suppliers() async =>
      asList(await get('/suppliers'));
  Future<List<Map<String, dynamic>>> prescriptions() async =>
      asList(await get('/prescriptions'));
  Future<List<Map<String, dynamic>>> orders() async =>
      asList(await get('/orders'));

  Future<Map<String, dynamic>> addCustomer(Map<String, dynamic> payload) async {
    return asMap(await post('/customers', payload));
  }

  Future<Map<String, dynamic>> createSale(Map<String, dynamic> payload) async {
    return asMap(await post('/sales', payload));
  }

  Future<Map<String, dynamic>> placeOrder(Map<String, dynamic> payload) async {
    return asMap(await post('/orders', payload));
  }

  Future<Map<String, dynamic>> updateOrderStatus(
    String id,
    Map<String, dynamic> payload,
  ) async {
    return asMap(await patch('/orders/$id/status', payload));
  }
}

class ApiException implements Exception {
  ApiException(this.message);
  final String message;
  @override
  String toString() => message;
}

class User {
  User({required this.name, required this.email, required this.role});
  final String name;
  final String email;
  final String role;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      name: text(json['name']),
      email: text(json['email']),
      role: text(json['role']),
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key, required this.api, required this.onSignedIn});
  final ApiClient api;
  final ValueChanged<User> onSignedIn;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final email = TextEditingController(text: 'admin@mnexpharma.com');
  final password = TextEditingController(text: 'admin123');
  bool loading = false;
  bool obscure = true;
  String? error;

  Future<void> _submit() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final user = await widget.api.login(email.text.trim(), password.text);
      widget.onSignedIn(user);
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFE9FFF9), Color(0xFFF6F8FF), Color(0xFFFFFFFF)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(22),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 480),
                child: TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: 1),
                  duration: const Duration(milliseconds: 850),
                  curve: Curves.easeOutCubic,
                  builder: (context, value, child) => Opacity(
                    opacity: value,
                    child: Transform.translate(
                      offset: Offset(0, 28 * (1 - value)),
                      child: Transform.scale(
                        scale: .96 + (.04 * value),
                        child: child,
                      ),
                    ),
                  ),
                  child: _LandingCard(
                    email: email,
                    password: password,
                    obscure: obscure,
                    loading: loading,
                    error: error,
                    onTogglePassword: () => setState(() => obscure = !obscure),
                    onCustomer: () => Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => CustomerShopPage(api: widget.api),
                      ),
                    ),
                    onStaffLogin: _submit,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _LandingCard extends StatelessWidget {
  const _LandingCard({
    required this.email,
    required this.password,
    required this.obscure,
    required this.loading,
    required this.error,
    required this.onTogglePassword,
    required this.onCustomer,
    required this.onStaffLogin,
  });

  final TextEditingController email;
  final TextEditingController password;
  final bool obscure;
  final bool loading;
  final String? error;
  final VoidCallback onTogglePassword;
  final VoidCallback onCustomer;
  final VoidCallback onStaffLogin;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: .9),
        borderRadius: BorderRadius.circular(34),
        border: Border.all(color: Colors.white.withValues(alpha: .8)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x1F0F8F83),
            blurRadius: 38,
            offset: Offset(0, 20),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [
                  Color(0xFF0B7F79),
                  Color(0xFF16B89E),
                  Color(0xFF4F8DF7),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(28),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _BrandHeader(light: true),
                const SizedBox(height: 30),
                Text(
                  'Pharmacy care, delivered',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    height: 1.06,
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Shop medicines, submit prescriptions, and follow every delivery update from pickup to confirmation.',
                  style: TextStyle(color: Colors.white, height: 1.45),
                ),
                const SizedBox(height: 22),
                FilledButton.icon(
                  style: FilledButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF0B7F79),
                    minimumSize: const Size.fromHeight(54),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                  ),
                  onPressed: onCustomer,
                  icon: const Icon(Icons.shopping_bag_outlined),
                  label: const Text('Shop medicines'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          Material(
            color: const Color(0xFFF7FAFC),
            borderRadius: BorderRadius.circular(22),
            clipBehavior: Clip.antiAlias,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: const Color(0xFFE5EDF4)),
              ),
              child: ExpansionTile(
                tilePadding: const EdgeInsets.symmetric(horizontal: 16),
                leading: const Icon(Icons.admin_panel_settings_outlined),
                title: const Text('Staff access'),
                subtitle: const Text('Orders, inventory, billing and delivery'),
                childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                children: [
                  TextField(
                    controller: email,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(labelText: 'Staff email'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: password,
                    obscureText: obscure,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      suffixIcon: IconButton(
                        onPressed: onTogglePassword,
                        icon: Icon(
                          obscure ? Icons.visibility : Icons.visibility_off,
                        ),
                      ),
                    ),
                  ),
                  if (error != null) ...[
                    const SizedBox(height: 12),
                    _ErrorBanner(message: error!),
                  ],
                  const SizedBox(height: 14),
                  FilledButton.icon(
                    onPressed: loading ? null : onStaffLogin,
                    icon: loading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.login),
                    label: const Text('Open staff dashboard'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class CustomerShopPage extends StatefulWidget {
  const CustomerShopPage({super.key, required this.api});
  final ApiClient api;

  @override
  State<CustomerShopPage> createState() => _CustomerShopPageState();
}

class _CustomerShopPageState extends State<CustomerShopPage> {
  late Future<List<Map<String, dynamic>>> future = widget.api.catalog();
  Future<List<Map<String, dynamic>>>? ordersFuture;
  final name = TextEditingController();
  final phone = TextEditingController();
  final address = TextEditingController();
  final trackPhone = TextEditingController();
  final prescriptionNote = TextEditingController();
  final imagePicker = ImagePicker();
  final cart = <CartLine>[];
  int tab = 0;
  String query = '';
  String category = 'All';
  String paymentMethod = 'cash_on_delivery';
  bool prescriptionAttached = false;
  String prescriptionLabel = '';
  String prescriptionMimeType = '';
  String prescriptionBase64 = '';
  int prescriptionSize = 0;
  bool saving = false;
  String? error;

  double get subtotal => cart.fold(0, (sum, line) => sum + line.total);
  double get deliveryFee => cart.isEmpty || paymentMethod == 'pickup' ? 0 : 60;
  double get total => subtotal + deliveryFee;

  @override
  void initState() {
    super.initState();
    _loadCustomerProfile();
  }

  Future<void> _loadCustomerProfile() async {
    final prefs = await SharedPreferences.getInstance();
    name.text = prefs.getString('customer_name') ?? '';
    phone.text = prefs.getString('customer_phone') ?? '';
    address.text = prefs.getString('customer_address') ?? '';
    trackPhone.text = phone.text;
    if (mounted) setState(() {});
  }

  Future<void> _saveCustomerProfile() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('customer_name', name.text.trim());
    await prefs.setString('customer_phone', phone.text.trim());
    await prefs.setString('customer_address', address.text.trim());
  }

  void addToCart(Map<String, dynamic> medicine) {
    final stock = number(medicine['stock']).toInt();
    if (stock <= 0) return;
    final existing = cart
        .where((line) => text(line.medicine['id']) == text(medicine['id']))
        .firstOrNull;
    setState(() {
      error = null;
      if (existing == null) {
        cart.add(CartLine(medicine: medicine, qty: 1));
      } else if (existing.qty < stock) {
        existing.qty += 1;
      }
    });
  }

  Future<void> attachPrescriptionPhoto() async {
    try {
      final picked = await imagePicker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 72,
        maxWidth: 1600,
      );
      if (picked == null) return;
      final bytes = await picked.readAsBytes();
      setState(() {
        prescriptionAttached = true;
        prescriptionLabel = picked.name;
        prescriptionMimeType = picked.mimeType ?? 'image/jpeg';
        prescriptionBase64 = base64Encode(bytes);
        prescriptionSize = bytes.length;
        error = null;
      });
    } catch (e) {
      setState(() => error = 'Could not attach prescription: $e');
    }
  }

  Future<void> submitOrder() async {
    if (cart.isEmpty) {
      setState(() => error = 'Add at least one medicine first.');
      return;
    }
    if (name.text.trim().isEmpty ||
        phone.text.trim().isEmpty ||
        address.text.trim().isEmpty) {
      setState(() => error = 'Name, phone, and address are required.');
      return;
    }
    final needsPrescription = cart.any(
      (line) => line.medicine['prescription_required'] == true,
    );
    if (needsPrescription && !prescriptionAttached) {
      setState(
        () => error = 'A prescription is required for one or more medicines.',
      );
      return;
    }

    setState(() {
      saving = true;
      error = null;
    });
    try {
      await _saveCustomerProfile();
      final order = await widget.api.placeOrder({
        'customer': {
          'name': name.text.trim(),
          'phone': phone.text.trim(),
          'address': address.text.trim(),
        },
        'items': cart
            .map(
              (line) => {'medicine_id': line.medicine['id'], 'qty': line.qty},
            )
            .toList(),
        'delivery_fee': deliveryFee,
        'payment_method': paymentMethod,
        'prescription': {
          'attached': prescriptionAttached,
          'label': prescriptionLabel,
          'mime_type': prescriptionMimeType,
          'size': prescriptionSize,
          'image_base64': prescriptionBase64,
          'note': prescriptionNote.text.trim(),
        },
        'notes': 'Mobile app order',
      });
      if (!mounted) return;
      await showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Order placed'),
          content: Text(
            'Your order ${text(order['id'])} is pending.\nTotal: BDT ${money(number(order['total']))}',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK'),
            ),
          ],
        ),
      );
      setState(() {
        trackPhone.text = phone.text.trim();
        ordersFuture = widget.api.customerOrders(trackPhone.text);
        tab = 2;
        cart.clear();
        prescriptionAttached = false;
        prescriptionLabel = '';
        prescriptionMimeType = '';
        prescriptionBase64 = '';
        prescriptionSize = 0;
        prescriptionNote.clear();
        future = widget.api.catalog();
      });
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      if (mounted) setState(() => saving = false);
    }
  }

  void trackOrders() {
    if (trackPhone.text.trim().isEmpty) {
      setState(() => error = 'Enter your phone number to track orders.');
      return;
    }
    setState(() {
      error = null;
      ordersFuture = widget.api.customerOrders(trackPhone.text.trim());
    });
  }

  Future<void> _showMedicineDetails(Map<String, dynamic> medicine) async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (context) => MedicineDetailsSheet(
        medicine: medicine,
        onAdd: () {
          Navigator.pop(context);
          addToCart(medicine);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('MNEX Pharma')),
      bottomNavigationBar: NavigationBar(
        selectedIndex: tab,
        onDestinationSelected: (value) => setState(() => tab = value),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.storefront_outlined),
            selectedIcon: Icon(Icons.storefront),
            label: 'Shop',
          ),
          NavigationDestination(
            icon: Icon(Icons.shopping_cart_outlined),
            selectedIcon: Icon(Icons.shopping_cart),
            label: 'Cart',
          ),
          NavigationDestination(
            icon: Icon(Icons.delivery_dining_outlined),
            selectedIcon: Icon(Icons.delivery_dining),
            label: 'Track',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
      body: FutureView<List<Map<String, dynamic>>>(
        future: future,
        builder: (catalog) {
          final categories = [
            'All',
            ...{
              for (final medicine in catalog)
                if (text(medicine['category']).isNotEmpty)
                  text(medicine['category']),
            },
          ];
          final medicines = catalog.where((medicine) {
            final q = query.toLowerCase();
            final matchesCategory =
                category == 'All' || text(medicine['category']) == category;
            final matchesSearch =
                text(medicine['name']).toLowerCase().contains(q) ||
                text(medicine['generic']).toLowerCase().contains(q) ||
                text(medicine['category']).toLowerCase().contains(q);
            return matchesCategory && matchesSearch;
          }).toList();
          if (tab == 1) return _CustomerGradientSurface(child: _buildCart());
          if (tab == 2) {
            return _CustomerGradientSurface(child: _buildTracking());
          }
          if (tab == 3) return _CustomerGradientSurface(child: _buildProfile());
          final medicineTiles = medicines
              .take(12)
              .map(
                (medicine) => _OrderMedicineTile(
                  medicine: medicine,
                  onAdd: () => addToCart(medicine),
                  onView: () => _showMedicineDetails(medicine),
                ),
              )
              .toList();
          return _CustomerGradientSurface(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _HeroPanel(
                  title: 'Find your medicine',
                  subtitle:
                      '${catalog.length} items available for delivery or pickup',
                  icon: Icons.delivery_dining,
                ),
                const SizedBox(height: 16),
                const Row(
                  children: [
                    Expanded(
                      child: _ServiceBadge(
                        icon: Icons.verified_user_outlined,
                        label: 'Verified inventory',
                      ),
                    ),
                    SizedBox(width: 10),
                    Expanded(
                      child: _ServiceBadge(
                        icon: Icons.schedule_outlined,
                        label: 'Live order tracking',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  onChanged: (value) => setState(() => query = value),
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.search),
                    hintText: 'Search medicine',
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 42,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: categories.length,
                    separatorBuilder: (_, _) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final item = categories[index];
                      return ChoiceChip(
                        label: Text(item),
                        selected: category == item,
                        onSelected: (_) => setState(() => category = item),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 12),
                ...medicineTiles,
                if (medicines.isEmpty)
                  const _EmptyState(
                    message: 'No matching medicines in this category.',
                  ),
                const SizedBox(height: 80),
              ],
            ),
          );
        },
      ),
      floatingActionButton: tab == 0 && cart.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: () => setState(() => tab = 1),
              icon: const Icon(Icons.shopping_cart_checkout),
              label: Text('${cart.length} items . BDT ${money(subtotal)}'),
            )
          : null,
    );
  }

  Widget _buildCart() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _HeroPanel(
          title: 'Checkout',
          subtitle: cart.isEmpty
              ? 'Your cart is empty'
              : '${cart.length} items ready to order',
          icon: Icons.shopping_cart_checkout,
        ),
        const SizedBox(height: 18),
        ...cart.map(
          (line) => _CartTile(
            line: line,
            onChanged: () => setState(() {}),
            onRemove: () => setState(() => cart.remove(line)),
          ),
        ),
        if (cart.isEmpty)
          const _EmptyState(message: 'Add medicines from Shop first.'),
        const SizedBox(height: 12),
        _Card(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _SummaryLine(label: 'Subtotal', value: 'BDT ${money(subtotal)}'),
              const SizedBox(height: 6),
              _SummaryLine(
                label: 'Delivery fee',
                value: 'BDT ${money(deliveryFee)}',
              ),
              const Divider(height: 22),
              _SummaryLine(
                label: 'Total',
                value: 'BDT ${money(total)}',
                strong: true,
              ),
              const SizedBox(height: 12),
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(
                    value: 'cash_on_delivery',
                    label: Text('Delivery'),
                    icon: Icon(Icons.delivery_dining),
                  ),
                  ButtonSegment(
                    value: 'pickup',
                    label: Text('Pickup'),
                    icon: Icon(Icons.storefront),
                  ),
                ],
                selected: {paymentMethod},
                onSelectionChanged: (value) =>
                    setState(() => paymentMethod = value.first),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: name,
          decoration: const InputDecoration(labelText: 'Full name'),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: phone,
          keyboardType: TextInputType.phone,
          decoration: const InputDecoration(labelText: 'Phone number'),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: address,
          minLines: 2,
          maxLines: 4,
          decoration: InputDecoration(
            labelText: paymentMethod == 'pickup'
                ? 'Address/contact note'
                : 'Delivery address',
          ),
        ),
        const SizedBox(height: 12),
        _PrescriptionCard(
          requiredForOrder: cart.any(
            (line) => line.medicine['prescription_required'] == true,
          ),
          attached: prescriptionAttached,
          label: prescriptionLabel,
          size: prescriptionSize,
          note: prescriptionNote,
          onAttach: attachPrescriptionPhoto,
          onRemove: () => setState(() {
            prescriptionAttached = false;
            prescriptionLabel = '';
            prescriptionMimeType = '';
            prescriptionBase64 = '';
            prescriptionSize = 0;
            prescriptionNote.clear();
          }),
        ),
        if (error != null) ...[
          const SizedBox(height: 12),
          _ErrorBanner(message: error!),
        ],
        const SizedBox(height: 14),
        FilledButton.icon(
          onPressed: saving ? null : submitOrder,
          icon: saving
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Icon(Icons.verified_outlined),
          label: Text(saving ? 'Placing order...' : 'Place order'),
        ),
      ],
    );
  }

  Widget _buildTracking() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _HeroPanel(
          title: 'Track order',
          subtitle: 'Use the same phone number used at checkout',
          icon: Icons.delivery_dining,
        ),
        const SizedBox(height: 16),
        TextField(
          controller: trackPhone,
          keyboardType: TextInputType.phone,
          decoration: const InputDecoration(
            labelText: 'Phone number',
            prefixIcon: Icon(Icons.phone_outlined),
          ),
        ),
        const SizedBox(height: 10),
        FilledButton.icon(
          onPressed: trackOrders,
          icon: const Icon(Icons.search),
          label: const Text('Find my orders'),
        ),
        if (error != null) ...[
          const SizedBox(height: 12),
          _ErrorBanner(message: error!),
        ],
        const SizedBox(height: 18),
        if (ordersFuture == null)
          const _EmptyState(message: 'Track orders using your phone number.')
        else
          FutureView<List<Map<String, dynamic>>>(
            future: ordersFuture!,
            builder: (orders) => Column(
              children: [
                ...orders.map((order) => _OrderStatusCard(order: order)),
                if (orders.isEmpty)
                  const _EmptyState(
                    message: 'No orders linked to this phone number.',
                  ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildProfile() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _HeroPanel(
          title: 'My profile',
          subtitle: 'Saved for faster checkout and order tracking',
          icon: Icons.person,
        ),
        const SizedBox(height: 16),
        TextField(
          controller: name,
          decoration: const InputDecoration(
            labelText: 'Full name',
            prefixIcon: Icon(Icons.person_outline),
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: phone,
          keyboardType: TextInputType.phone,
          decoration: const InputDecoration(
            labelText: 'Phone number',
            prefixIcon: Icon(Icons.phone_outlined),
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: address,
          minLines: 2,
          maxLines: 4,
          decoration: const InputDecoration(
            labelText: 'Default address',
            prefixIcon: Icon(Icons.location_on_outlined),
          ),
        ),
        const SizedBox(height: 14),
        FilledButton.icon(
          onPressed: () async {
            await _saveCustomerProfile();
            trackPhone.text = phone.text.trim();
            if (mounted) {
              ScaffoldMessenger.of(context)
                  .showSnackBar(const SnackBar(content: Text('Profile saved')));
            }
          },
          icon: const Icon(Icons.save_outlined),
          label: const Text('Save profile'),
        ),
        const SizedBox(height: 18),
        _Card(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                'Quick checkout',
                style: TextStyle(fontWeight: FontWeight.w900),
              ),
              SizedBox(height: 8),
              Text(
                'Save your contact and delivery details once, then reorder faster next time.',
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({
    super.key,
    required this.api,
    required this.user,
    required this.onLogout,
  });
  final ApiClient api;
  final User user;
  final Future<void> Function() onLogout;

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      DashboardPage(api: widget.api),
      MedicinesPage(api: widget.api),
      SalesPage(api: widget.api),
      CustomersPage(api: widget.api),
      MorePage(api: widget.api),
    ];
    final titles = ['Dashboard', 'Medicines', 'Sales POS', 'Customers', 'More'];
    return Scaffold(
      appBar: AppBar(
        title: Text(titles[index]),
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'logout') widget.onLogout();
            },
            itemBuilder: (context) => [
              PopupMenuItem(enabled: false, child: Text(widget.user.name)),
              PopupMenuItem(enabled: false, child: Text(widget.user.role)),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'logout', child: Text('Logout')),
            ],
            child: Padding(
              padding: const EdgeInsets.only(right: 16),
              child: CircleAvatar(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
                child: Text(initials(widget.user.name)),
              ),
            ),
          ),
        ],
      ),
      body: pages[index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (value) => setState(() => index = value),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.medication_outlined),
            selectedIcon: Icon(Icons.medication),
            label: 'Meds',
          ),
          NavigationDestination(
            icon: Icon(Icons.point_of_sale_outlined),
            selectedIcon: Icon(Icons.point_of_sale),
            label: 'Sales',
          ),
          NavigationDestination(
            icon: Icon(Icons.groups_outlined),
            selectedIcon: Icon(Icons.groups),
            label: 'Patients',
          ),
          NavigationDestination(
            icon: Icon(Icons.more_horiz),
            selectedIcon: Icon(Icons.more),
            label: 'More',
          ),
        ],
      ),
    );
  }
}

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key, required this.api});
  final ApiClient api;

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  late Future<Map<String, dynamic>> future = widget.api.dashboard();

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () async => setState(() => future = widget.api.dashboard()),
      child: FutureView<Map<String, dynamic>>(
        future: future,
        builder: (data) {
          final stats = asList(data['stats']);
          final lowStock = asList(data['low_stock']);
          final recentSales = asList(data['recent_sales']);
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _HeroPanel(
                title: 'MNEX Pharma',
                subtitle: 'Operational pharmacy summary',
                icon: Icons.local_pharmacy,
                trailing: IconButton.filledTonal(
                  onPressed: () =>
                      setState(() => future = widget.api.dashboard()),
                  icon: const Icon(Icons.refresh),
                ),
              ),
              const SizedBox(height: 16),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.28,
                ),
                itemCount: stats.length,
                itemBuilder: (context, index) {
                  final stat = stats[index];
                  return _MetricCard(
                    label: text(stat['label']),
                    value: text(stat['value']),
                    sub: text(stat['sub']),
                    icon: _statIcon(index),
                  );
                },
              ),
              const SizedBox(height: 20),
              _SectionTitle('Low stock alerts'),
              ...lowStock.take(5).map((m) => _MedicineTile(medicine: m)),
              if (lowStock.isEmpty)
                const _EmptyState(message: 'No low stock medicines right now.'),
              const SizedBox(height: 20),
              _SectionTitle('Recent invoices'),
              ...recentSales.take(6).map((sale) => _SaleTile(sale: sale)),
            ],
          );
        },
      ),
    );
  }
}

class MedicinesPage extends StatefulWidget {
  const MedicinesPage({super.key, required this.api});
  final ApiClient api;

  @override
  State<MedicinesPage> createState() => _MedicinesPageState();
}

class _MedicinesPageState extends State<MedicinesPage> {
  late Future<List<Map<String, dynamic>>> future = widget.api.medicines();
  String query = '';

  @override
  Widget build(BuildContext context) {
    return FutureView<List<Map<String, dynamic>>>(
      future: future,
      builder: (medicines) {
        final filtered = medicines.where((m) {
          final q = query.toLowerCase();
          return text(m['name']).toLowerCase().contains(q) ||
              text(m['generic']).toLowerCase().contains(q) ||
              text(m['category']).toLowerCase().contains(q);
        }).toList();
        return RefreshIndicator(
          onRefresh: () async =>
              setState(() => future = widget.api.medicines()),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              TextField(
                onChanged: (value) => setState(() => query = value),
                decoration: const InputDecoration(
                  prefixIcon: Icon(Icons.search),
                  hintText: 'Search medicine, generic, category',
                ),
              ),
              const SizedBox(height: 16),
              _HeroPanel(
                title: '${medicines.length} medicines',
                subtitle: '${filtered.length} visible in formulary',
                icon: Icons.medication,
              ),
              const SizedBox(height: 12),
              ...filtered.map(
                (m) => _MedicineTile(medicine: m, detailed: true),
              ),
              if (filtered.isEmpty)
                const _EmptyState(message: 'No medicine matched your search.'),
            ],
          ),
        );
      },
    );
  }
}

class SalesPage extends StatefulWidget {
  const SalesPage({super.key, required this.api});
  final ApiClient api;

  @override
  State<SalesPage> createState() => _SalesPageState();
}

class _SalesPageState extends State<SalesPage> {
  late Future<List<Map<String, dynamic>>> medicinesFuture = widget.api
      .medicines();
  final cash = TextEditingController();
  final customer = TextEditingController(text: 'Walk-in Patient');
  final cart = <CartLine>[];
  String query = '';
  String paymentMethod = 'cash';
  bool saving = false;
  String? error;

  double get subtotal => cart.fold(0, (sum, line) => sum + line.total);
  double get paid => number(cash.text);
  double get changeDue => (paid - subtotal).clamp(0, double.infinity);
  bool get canFinalize =>
      cart.isNotEmpty &&
      subtotal > 0 &&
      (paymentMethod != 'cash' || paid >= subtotal) &&
      !saving;

  void addMedicine(Map<String, dynamic> medicine) {
    final stock = number(medicine['stock']).toInt();
    if (stock <= 0) return;
    final existing = cart
        .where((line) => text(line.medicine['id']) == text(medicine['id']))
        .firstOrNull;
    setState(() {
      error = null;
      if (existing == null) {
        cart.add(CartLine(medicine: medicine, qty: 1));
      } else if (existing.qty < stock) {
        existing.qty += 1;
      }
    });
  }

  Future<void> finalizeBill() async {
    if (!canFinalize) {
      setState(
        () => error = cart.isEmpty
            ? 'Add at least one medicine first.'
            : 'Cash must cover the total bill.',
      );
      return;
    }
    setState(() {
      saving = true;
      error = null;
    });
    final now = DateTime.now();
    final payload = {
      'customer': customer.text.trim().isEmpty
          ? 'Walk-in Patient'
          : customer.text.trim(),
      'phone': '',
      'items': cart
          .map(
            (line) => {
              'medicine_id': line.medicine['id'],
              'name': text(line.medicine['name']),
              'qty': line.qty,
              'price': number(line.medicine['price']),
              'total': line.total,
            },
          )
          .toList(),
      'subtotal': subtotal,
      'discount': 0,
      'vat': 0,
      'total': subtotal,
      'paid': paymentMethod == 'cash' ? paid : subtotal,
      'change': changeDue,
      'payment_method': paymentMethod,
      'date': DateFormat('yyyy-MM-dd').format(now),
      'time': DateFormat('HH:mm').format(now),
      'status': 'paid',
    };
    try {
      final sale = await widget.api.createSale(payload);
      if (!mounted) return;
      await showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Bill finalized'),
          content: Text(
            'Invoice ${text(sale['id'])} saved successfully.\nTotal: BDT ${money(subtotal)}',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK'),
            ),
          ],
        ),
      );
      setState(() {
        cart.clear();
        cash.clear();
        medicinesFuture = widget.api.medicines();
      });
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      if (mounted) setState(() => saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureView<List<Map<String, dynamic>>>(
      future: medicinesFuture,
      builder: (medicines) {
        final filtered = medicines
            .where(
              (m) =>
                  text(m['name']).toLowerCase().contains(query.toLowerCase()),
            )
            .take(20)
            .toList();
        return ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextField(
              onChanged: (value) => setState(() => query = value),
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.search),
                hintText: 'Search medicine to add',
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 112,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: filtered.length,
                separatorBuilder: (_, _) => const SizedBox(width: 10),
                itemBuilder: (context, index) {
                  final med = filtered[index];
                  return _ProductPickCard(
                    medicine: med,
                    onTap: () => addMedicine(med),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),
            _SectionTitle('Current bill'),
            TextField(
              controller: customer,
              decoration: const InputDecoration(labelText: 'Customer name'),
            ),
            const SizedBox(height: 12),
            ...cart.map(
              (line) => _CartTile(
                line: line,
                onChanged: () => setState(() {}),
                onRemove: () => setState(() => cart.remove(line)),
              ),
            ),
            if (cart.isEmpty)
              const _EmptyState(
                message: 'Select medicines above to start a bill.',
              ),
            const SizedBox(height: 16),
            _PaymentPanel(
              total: subtotal,
              cash: cash,
              paymentMethod: paymentMethod,
              changeDue: changeDue,
              onPaymentChanged: (value) =>
                  setState(() => paymentMethod = value),
              onCashChanged: () => setState(() {}),
            ),
            if (error != null) ...[
              const SizedBox(height: 12),
              _ErrorBanner(message: error!),
            ],
            const SizedBox(height: 12),
            FilledButton.icon(
              onPressed: canFinalize ? finalizeBill : null,
              icon: saving
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.check_circle_outline),
              label: Text(
                cart.isEmpty ? 'Add medicine first' : 'Finalise bill',
              ),
            ),
          ],
        );
      },
    );
  }
}

class CustomersPage extends StatefulWidget {
  const CustomersPage({super.key, required this.api});
  final ApiClient api;

  @override
  State<CustomersPage> createState() => _CustomersPageState();
}

class _CustomersPageState extends State<CustomersPage> {
  late Future<List<Map<String, dynamic>>> future = widget.api.customers();
  String query = '';

  Future<void> _addCustomer() async {
    final created = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      builder: (context) => AddCustomerSheet(api: widget.api),
    );
    if (created == true) setState(() => future = widget.api.customers());
  }

  @override
  Widget build(BuildContext context) {
    return FutureView<List<Map<String, dynamic>>>(
      future: future,
      builder: (customers) {
        final filtered = customers.where((c) {
          final q = query.toLowerCase();
          return text(c['name']).toLowerCase().contains(q) ||
              text(c['phone']).toLowerCase().contains(q);
        }).toList();
        return ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Row(
              children: [
                Expanded(
                  child: TextField(
                    onChanged: (value) => setState(() => query = value),
                    decoration: const InputDecoration(
                      prefixIcon: Icon(Icons.search),
                      hintText: 'Search patient',
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                IconButton.filled(
                  onPressed: _addCustomer,
                  icon: const Icon(Icons.person_add),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _HeroPanel(
              title: '${customers.length} patients',
              subtitle: 'Customer records and purchase history',
              icon: Icons.groups,
            ),
            const SizedBox(height: 12),
            ...filtered.map((customer) => _CustomerTile(customer: customer)),
            if (filtered.isEmpty)
              const _EmptyState(message: 'No matching patient records.'),
          ],
        );
      },
    );
  }
}

class MorePage extends StatefulWidget {
  const MorePage({super.key, required this.api});
  final ApiClient api;

  @override
  State<MorePage> createState() => _MorePageState();
}

class _MorePageState extends State<MorePage> {
  late Future<List<dynamic>> future = Future.wait([
    widget.api.suppliers(),
    widget.api.prescriptions(),
    widget.api.purchasesSummary(),
    widget.api.reports(),
    widget.api.orders(),
  ]);

  void _reload() {
    future = Future.wait([
      widget.api.suppliers(),
      widget.api.prescriptions(),
      widget.api.purchasesSummary(),
      widget.api.reports(),
      widget.api.orders(),
    ]);
  }

  Future<void> _setOrderStatus(
    Map<String, dynamic> order,
    String status,
  ) async {
    final payload = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      builder: (context) => DeliveryUpdateSheet(order: order, status: status),
    );
    if (payload == null) return;
    await widget.api.updateOrderStatus(text(order['id']), payload);
    if (mounted) setState(_reload);
  }

  @override
  Widget build(BuildContext context) {
    return FutureView<List<dynamic>>(
      future: future,
      builder: (data) {
        final suppliers = data[0] as List<Map<String, dynamic>>;
        final prescriptions = data[1] as List<Map<String, dynamic>>;
        final purchases = asMap(data[2])['purchases'];
        final reports = asMap(data[3]);
        final orders = data[4] as List<Map<String, dynamic>>;
        return RefreshIndicator(
          onRefresh: () async => setState(_reload),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _HeroPanel(
                title: 'Management tools',
                subtitle: 'Suppliers, prescriptions, purchases and reports',
                icon: Icons.apps,
              ),
              const SizedBox(height: 16),
              _SummaryRow(
                label: 'Active suppliers',
                value: suppliers
                    .where((s) => text(s['status']) == 'active')
                    .length
                    .toString(),
                icon: Icons.local_shipping,
              ),
              _SummaryRow(
                label: 'Total prescriptions',
                value: prescriptions.length.toString(),
                icon: Icons.receipt_long,
              ),
              _SummaryRow(
                label: 'Purchase records',
                value: asList(purchases).length.toString(),
                icon: Icons.inventory_2,
              ),
              _SummaryRow(
                label: 'Report invoices',
                value: asList(reports['sales_report']).length.toString(),
                icon: Icons.bar_chart,
              ),
              _SummaryRow(
                label: 'Customer orders',
                value: orders.length.toString(),
                icon: Icons.shopping_bag,
              ),
              const SizedBox(height: 20),
              _SectionTitle('Customer orders'),
              ...orders
                  .take(6)
                  .map(
                    (order) => _AdminOrderTile(
                      order: order,
                      onStatus: (status) => _setOrderStatus(order, status),
                    ),
                  ),
              if (orders.isEmpty)
                const _EmptyState(message: 'No customer orders yet.'),
              const SizedBox(height: 20),
              _SectionTitle('Prescription queue'),
              ...prescriptions
                  .take(6)
                  .map(
                    (rx) => _InfoTile(
                      title: text(
                        rx['patient'] ?? rx['customer'] ?? rx['name'],
                      ),
                      subtitle: '${text(rx['id'])} . ${text(rx['status'])}',
                      icon: Icons.description_outlined,
                    ),
                  ),
              const SizedBox(height: 20),
              _SectionTitle('Suppliers'),
              ...suppliers
                  .take(8)
                  .map(
                    (s) => _InfoTile(
                      title: text(s['name']),
                      subtitle: '${text(s['phone'])} . ${text(s['status'])}',
                      icon: Icons.storefront,
                    ),
                  ),
            ],
          ),
        );
      },
    );
  }
}

class AddCustomerSheet extends StatefulWidget {
  const AddCustomerSheet({super.key, required this.api});
  final ApiClient api;

  @override
  State<AddCustomerSheet> createState() => _AddCustomerSheetState();
}

class _AddCustomerSheetState extends State<AddCustomerSheet> {
  final name = TextEditingController();
  final phone = TextEditingController();
  final email = TextEditingController();
  bool saving = false;
  String? error;

  Future<void> submit() async {
    if (name.text.trim().isEmpty || phone.text.trim().isEmpty) {
      setState(() => error = 'Name and phone are required.');
      return;
    }
    setState(() {
      saving = true;
      error = null;
    });
    try {
      await widget.api.addCustomer({
        'name': name.text.trim(),
        'phone': phone.text.trim(),
        'email': email.text.trim(),
        'visits': 0,
        'total_purchases': 0,
        'loyalty_points': 0,
        'status': 'active',
      });
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      if (mounted) setState(() => saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.viewInsetsOf(context).bottom + 20,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Add patient',
            style: Theme.of(context).textTheme.titleLarge
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: name,
            decoration: const InputDecoration(labelText: 'Name'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: phone,
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(labelText: 'Phone'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: email,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(labelText: 'Email optional'),
          ),
          if (error != null) ...[
            const SizedBox(height: 12),
            _ErrorBanner(message: error!),
          ],
          const SizedBox(height: 16),
          FilledButton(
            onPressed: saving ? null : submit,
            child: Text(saving ? 'Saving...' : 'Save patient'),
          ),
        ],
      ),
    );
  }
}

class DeliveryUpdateSheet extends StatefulWidget {
  const DeliveryUpdateSheet({
    super.key,
    required this.order,
    required this.status,
  });
  final Map<String, dynamic> order;
  final String status;

  @override
  State<DeliveryUpdateSheet> createState() => _DeliveryUpdateSheetState();
}

class _DeliveryUpdateSheetState extends State<DeliveryUpdateSheet> {
  late final riderName = TextEditingController(
    text: text(widget.order['rider_name']),
  );
  late final riderPhone = TextEditingController(
    text: text(widget.order['rider_phone']),
  );
  late final pickupTime = TextEditingController(
    text: text(widget.order['pickup_time']),
  );
  late final deliveryEta = TextEditingController(
    text: text(widget.order['delivery_eta']),
  );
  late final note = TextEditingController(text: text(widget.order['notes']));
  late final prescriptionReviewNote = TextEditingController(
    text: text(asMap(widget.order['prescription'])['review_note']),
  );
  late String prescriptionReviewStatus =
      text(asMap(widget.order['prescription'])['review_status']).isEmpty
      ? 'pending'
      : text(asMap(widget.order['prescription'])['review_status']);

  @override
  Widget build(BuildContext context) {
    final needsRider =
        widget.status == 'out_for_delivery' ||
        widget.status == 'delivered' ||
        widget.status == 'packing';
    final prescription = asMap(widget.order['prescription']);
    final hasPrescription = prescription['attached'] == true;
    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.viewInsetsOf(context).bottom + 20,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Update to ${orderStatusLabel(widget.status)}',
              style: Theme.of(context).textTheme.titleLarge
                  ?.copyWith(fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 6),
            Text(
              '${text(widget.order['id'])} . ${text(asMap(widget.order['customer'])['name'])}',
            ),
            const SizedBox(height: 16),
            if (hasPrescription) ...[
              _Card(
                margin: EdgeInsets.zero,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.assignment_turned_in_outlined),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            text(prescription['label']).isEmpty
                                ? 'Prescription attached'
                                : text(prescription['label']),
                            style: const TextStyle(fontWeight: FontWeight.w900),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    SegmentedButton<String>(
                      segments: const [
                        ButtonSegment(
                          value: 'pending',
                          label: Text('Pending'),
                          icon: Icon(Icons.hourglass_empty),
                        ),
                        ButtonSegment(
                          value: 'approved',
                          label: Text('Approve'),
                          icon: Icon(Icons.check_circle_outline),
                        ),
                        ButtonSegment(
                          value: 'rejected',
                          label: Text('Reject'),
                          icon: Icon(Icons.cancel_outlined),
                        ),
                      ],
                      selected: {prescriptionReviewStatus},
                      onSelectionChanged: (value) => setState(
                        () => prescriptionReviewStatus = value.first,
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: prescriptionReviewNote,
                      minLines: 2,
                      maxLines: 3,
                      decoration: const InputDecoration(
                        labelText: 'Prescription review note',
                        hintText: 'Checked by pharmacist.',
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],
            if (needsRider) ...[
              TextField(
                controller: riderName,
                decoration: const InputDecoration(
                  labelText: 'Rider name',
                  prefixIcon: Icon(Icons.badge_outlined),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: riderPhone,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Rider phone',
                  prefixIcon: Icon(Icons.phone_android),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: pickupTime,
                decoration: const InputDecoration(
                  labelText: 'Pickup time',
                  hintText: '4:30 PM',
                  prefixIcon: Icon(Icons.access_time),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: deliveryEta,
                decoration: const InputDecoration(
                  labelText: 'Delivery ETA',
                  hintText: '5:15 PM',
                  prefixIcon: Icon(Icons.schedule_send_outlined),
                ),
              ),
              const SizedBox(height: 10),
            ],
            TextField(
              controller: note,
              minLines: 2,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Update note',
                hintText: 'Rider picked up the order.',
              ),
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: () => Navigator.pop(context, {
                'status': widget.status,
                'rider_name': riderName.text.trim(),
                'rider_phone': riderPhone.text.trim(),
                'pickup_time': pickupTime.text.trim(),
                'delivery_eta': deliveryEta.text.trim(),
                'note': note.text.trim(),
                if (hasPrescription)
                  'prescription_review_status': prescriptionReviewStatus,
                if (hasPrescription)
                  'prescription_review_note': prescriptionReviewNote.text
                      .trim(),
              }),
              icon: const Icon(Icons.save_outlined),
              label: const Text('Save delivery update'),
            ),
          ],
        ),
      ),
    );
  }
}

class CartLine {
  CartLine({required this.medicine, required this.qty});
  final Map<String, dynamic> medicine;
  int qty;
  double get total => qty * number(medicine['price']);
}

class _PaymentPanel extends StatelessWidget {
  const _PaymentPanel({
    required this.total,
    required this.cash,
    required this.paymentMethod,
    required this.changeDue,
    required this.onPaymentChanged,
    required this.onCashChanged,
  });

  final double total;
  final TextEditingController cash;
  final String paymentMethod;
  final double changeDue;
  final ValueChanged<String> onPaymentChanged;
  final VoidCallback onCashChanged;

  @override
  Widget build(BuildContext context) {
    return _Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _SummaryLine(
            label: 'Grand total',
            value: 'BDT ${money(total)}',
            strong: true,
          ),
          const SizedBox(height: 12),
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(
                value: 'cash',
                label: Text('Cash'),
                icon: Icon(Icons.payments_outlined),
              ),
              ButtonSegment(
                value: 'card',
                label: Text('Card'),
                icon: Icon(Icons.credit_card),
              ),
              ButtonSegment(
                value: 'mobile_banking',
                label: Text('Mobile'),
                icon: Icon(Icons.phone_android),
              ),
            ],
            selected: {paymentMethod},
            onSelectionChanged: (value) => onPaymentChanged(value.first),
          ),
          if (paymentMethod == 'cash') ...[
            const SizedBox(height: 12),
            TextField(
              controller: cash,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              onChanged: (_) => onCashChanged(),
              decoration: const InputDecoration(labelText: 'Cash tendered'),
            ),
            const SizedBox(height: 8),
            _SummaryLine(label: 'Change due', value: 'BDT ${money(changeDue)}'),
          ],
        ],
      ),
    );
  }
}

class _CartTile extends StatelessWidget {
  const _CartTile({
    required this.line,
    required this.onChanged,
    required this.onRemove,
  });
  final CartLine line;
  final VoidCallback onChanged;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    final stock = number(line.medicine['stock']).toInt();
    return _Card(
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  text(line.medicine['name']),
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
                Text(
                  'BDT ${money(number(line.medicine['price']))} each . stock $stock',
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: line.qty <= 1
                ? null
                : () {
                    line.qty -= 1;
                    onChanged();
                  },
            icon: const Icon(Icons.remove_circle_outline),
          ),
          Text(
            '${line.qty}',
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
          IconButton(
            onPressed: line.qty >= stock
                ? null
                : () {
                    line.qty += 1;
                    onChanged();
                  },
            icon: const Icon(Icons.add_circle_outline),
          ),
          IconButton(
            onPressed: onRemove,
            icon: const Icon(Icons.delete_outline),
          ),
        ],
      ),
    );
  }
}

class _ProductPickCard extends StatelessWidget {
  const _ProductPickCard({required this.medicine, required this.onTap});
  final Map<String, dynamic> medicine;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 220,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: _Card(
          margin: EdgeInsets.zero,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                text(medicine['name']),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
              const Spacer(),
              Text('BDT ${money(number(medicine['price']))}'),
              Text('Stock ${number(medicine['stock']).toInt()}'),
            ],
          ),
        ),
      ),
    );
  }
}

class MedicineDetailsSheet extends StatelessWidget {
  const MedicineDetailsSheet({
    super.key,
    required this.medicine,
    required this.onAdd,
  });
  final Map<String, dynamic> medicine;
  final VoidCallback onAdd;

  @override
  Widget build(BuildContext context) {
    final requiresRx = medicine['prescription_required'] == true;
    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.viewInsetsOf(context).bottom + 20,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.teal.shade50,
                  foregroundColor: Colors.teal,
                  child: const Icon(Icons.medication_liquid, size: 30),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        text(medicine['name']),
                        style: Theme.of(context).textTheme.titleLarge
                            ?.copyWith(fontWeight: FontWeight.w900),
                      ),
                      Text(text(medicine['manufacturer'])),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _MiniInfoChip(
                  icon: Icons.category_outlined,
                  label: text(medicine['category']),
                ),
                _MiniInfoChip(
                  icon: Icons.inventory_2_outlined,
                  label: 'Stock ${number(medicine['stock']).toInt()}',
                ),
                if (requiresRx)
                  const _MiniInfoChip(
                    icon: Icons.assignment_outlined,
                    label: 'Prescription required',
                  ),
              ],
            ),
            const SizedBox(height: 18),
            _SummaryLine(label: 'Generic', value: text(medicine['generic'])),
            const SizedBox(height: 6),
            _SummaryLine(
              label: 'Strength',
              value:
                  '${text(medicine['dosage_form'])} . ${text(medicine['strength'])}',
            ),
            const SizedBox(height: 6),
            _SummaryLine(
              label: 'Price',
              value: 'BDT ${money(number(medicine['price']))}',
              strong: true,
            ),
            if (text(medicine['description']).isNotEmpty) ...[
              const SizedBox(height: 18),
              Text(
                text(medicine['description']),
                style: const TextStyle(height: 1.4),
              ),
            ],
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: onAdd,
              icon: const Icon(Icons.add_shopping_cart),
              label: const Text('Add to cart'),
            ),
          ],
        ),
      ),
    );
  }
}

class _PrescriptionCard extends StatelessWidget {
  const _PrescriptionCard({
    required this.requiredForOrder,
    required this.attached,
    required this.label,
    required this.size,
    required this.note,
    required this.onAttach,
    required this.onRemove,
  });
  final bool requiredForOrder;
  final bool attached;
  final String label;
  final int size;
  final TextEditingController note;
  final VoidCallback onAttach;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return _Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: requiredForOrder
                    ? Colors.orange.shade50
                    : Colors.teal.shade50,
                foregroundColor: requiredForOrder ? Colors.orange : Colors.teal,
                child: const Icon(Icons.assignment_outlined),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      requiredForOrder
                          ? 'Prescription required'
                          : 'Prescription optional',
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    Text(
                      attached ? '$label . ${formatBytes(size)}' : 'Upload a prescription for medicines that require approval.',
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextField(
            controller: note,
            minLines: 2,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Prescription note',
              hintText: 'Doctor prescribed 1 tablet daily.',
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onAttach,
                  icon: Icon(attached ? Icons.check_circle : Icons.upload_file),
                  label: Text(attached ? 'Change photo' : 'Attach photo'),
                ),
              ),
              if (attached) ...[
                const SizedBox(width: 10),
                IconButton.outlined(
                  onPressed: onRemove,
                  icon: const Icon(Icons.close),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class _OrderStatusCard extends StatelessWidget {
  const _OrderStatusCard({required this.order});
  final Map<String, dynamic> order;

  @override
  Widget build(BuildContext context) {
    final status = text(order['status']);
    final customer = asMap(order['customer']);
    final items = asList(order['items']);
    final prescription = asMap(order['prescription']);
    final history = asList(order['status_history']);
    return _Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  text(order['id']),
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
              ),
              _StatusPill(status: status),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            '${items.length} items . BDT ${money(number(order['total']))}',
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
          if (prescription['attached'] == true) ...[
            const SizedBox(height: 6),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                const _MiniInfoChip(
                  icon: Icons.assignment_turned_in_outlined,
                  label: 'Prescription attached',
                ),
                _PrescriptionReviewChip(prescription: prescription),
              ],
            ),
          ],
          const SizedBox(height: 6),
          Text('${text(order['date'])} ${text(order['time'])}'),
          if (text(customer['address']).isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(text(customer['address'])),
          ],
          const SizedBox(height: 10),
          _OrderTimeline(status: status),
          if (text(order['rider_name']).isNotEmpty ||
              text(order['delivery_eta']).isNotEmpty ||
              text(order['pickup_time']).isNotEmpty) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF1FAF8),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (text(order['rider_name']).isNotEmpty)
                    _SummaryLine(
                      label: 'Rider',
                      value:
                          '${text(order['rider_name'])} ${text(order['rider_phone'])}',
                    ),
                  if (text(order['pickup_time']).isNotEmpty)
                    _SummaryLine(
                      label: 'Pickup time',
                      value: prettyDateTime(text(order['pickup_time'])),
                    ),
                  if (text(order['delivery_eta']).isNotEmpty)
                    _SummaryLine(
                      label: 'Delivery ETA',
                      value: prettyDateTime(text(order['delivery_eta'])),
                    ),
                  if (text(order['delivered_at']).isNotEmpty)
                    _SummaryLine(
                      label: 'Delivered at',
                      value: prettyDateTime(text(order['delivered_at'])),
                    ),
                ],
              ),
            ),
          ],
          if (history.isNotEmpty) ...[
            const SizedBox(height: 14),
            Text(
              'Updates',
              style: Theme.of(context).textTheme.titleSmall
                  ?.copyWith(fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 8),
            ...history
                .take(5)
                .map(
                  (event) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(
                          Icons.check_circle,
                          size: 18,
                          color: statusColor(text(event['status'])),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            '${orderStatusLabel(text(event['status']))} . ${prettyDateTime(text(event['at']))}'
                            '${text(event['note']).isEmpty ? '' : '\n${text(event['note'])}'}',
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
          ],
        ],
      ),
    );
  }
}

class _AdminOrderTile extends StatelessWidget {
  const _AdminOrderTile({required this.order, required this.onStatus});
  final Map<String, dynamic> order;
  final ValueChanged<String> onStatus;

  @override
  Widget build(BuildContext context) {
    final customer = asMap(order['customer']);
    final prescription = asMap(order['prescription']);
    final status = text(order['status']);
    final terminal = status == 'delivered' || status == 'cancelled';
    final prescriptionRejected =
        text(prescription['review_status']) == 'rejected';
    return _Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: Colors.teal.shade50,
                foregroundColor: Colors.teal,
                child: const Icon(Icons.delivery_dining),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${text(customer['name'])} . ${text(order['id'])}',
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    Text(
                      '${text(customer['phone'])} . BDT ${money(number(order['total']))}',
                    ),
                  ],
                ),
              ),
              _StatusPill(status: status),
            ],
          ),
          if (text(customer['address']).isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(text(customer['address'])),
          ],
          if (prescription['attached'] == true) ...[
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _MiniInfoChip(
                  icon: Icons.assignment_turned_in_outlined,
                  label:
                      'Prescription ${text(prescription['label']).isEmpty ? 'attached' : text(prescription['label'])}',
                ),
                _PrescriptionReviewChip(prescription: prescription),
              ],
            ),
          ],
          if (text(order['rider_name']).isNotEmpty ||
              text(order['delivery_eta']).isNotEmpty) ...[
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                if (text(order['rider_name']).isNotEmpty)
                  _MiniInfoChip(
                    icon: Icons.delivery_dining,
                    label: 'Rider ${text(order['rider_name'])}',
                  ),
                if (text(order['pickup_time']).isNotEmpty)
                  _MiniInfoChip(
                    icon: Icons.access_time,
                    label:
                        'Pickup ${prettyDateTime(text(order['pickup_time']))}',
                  ),
                if (text(order['delivery_eta']).isNotEmpty)
                  _MiniInfoChip(
                    icon: Icons.schedule_send_outlined,
                    label: 'ETA ${prettyDateTime(text(order['delivery_eta']))}',
                  ),
              ],
            ),
          ],
          if (prescriptionRejected && !terminal) ...[
            const SizedBox(height: 12),
            _ErrorBanner(
              message: 'Prescription rejected. Contact customer or cancel this order.',
            ),
          ] else if (!terminal) ...[
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _StatusAction(
                  label: 'Confirm',
                  status: 'confirmed',
                  current: status,
                  onStatus: onStatus,
                ),
                _StatusAction(
                  label: 'Pack',
                  status: 'packing',
                  current: status,
                  onStatus: onStatus,
                ),
                _StatusAction(
                  label: 'Send',
                  status: 'out_for_delivery',
                  current: status,
                  onStatus: onStatus,
                ),
                _StatusAction(
                  label: 'Deliver',
                  status: 'delivered',
                  current: status,
                  onStatus: onStatus,
                ),
                _StatusAction(
                  label: 'Cancel',
                  status: 'cancelled',
                  current: status,
                  onStatus: onStatus,
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _StatusAction extends StatelessWidget {
  const _StatusAction({
    required this.label,
    required this.status,
    required this.current,
    required this.onStatus,
  });
  final String label;
  final String status;
  final String current;
  final ValueChanged<String> onStatus;

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      avatar: Icon(status == 'cancelled' ? Icons.close : Icons.check, size: 16),
      label: Text(label),
      onPressed: current == status ? null : () => onStatus(status),
    );
  }
}

class _MiniInfoChip extends StatelessWidget {
  const _MiniInfoChip({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        color: Colors.teal.shade50,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Colors.teal.shade100),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: Colors.teal.shade700),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              color: Colors.teal.shade900,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

class _PrescriptionReviewChip extends StatelessWidget {
  const _PrescriptionReviewChip({required this.prescription});
  final Map<String, dynamic> prescription;

  @override
  Widget build(BuildContext context) {
    final status = text(prescription['review_status']).isEmpty
        ? 'pending'
        : text(prescription['review_status']);
    final color = prescriptionReviewColor(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .12),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: color.withValues(alpha: .35)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(prescriptionReviewIcon(status), size: 16, color: color),
          const SizedBox(width: 6),
          Text(
            prescriptionReviewLabel(status),
            style: TextStyle(color: color, fontWeight: FontWeight.w800),
          ),
        ],
      ),
    );
  }
}

class _StatusPill extends StatelessWidget {
  const _StatusPill({required this.status});
  final String status;

  @override
  Widget build(BuildContext context) {
    final color = statusColor(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .12),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: color.withValues(alpha: .35)),
      ),
      child: Text(
        orderStatusLabel(status),
        style: TextStyle(color: color, fontWeight: FontWeight.w800),
      ),
    );
  }
}

class _OrderTimeline extends StatelessWidget {
  const _OrderTimeline({required this.status});
  final String status;

  @override
  Widget build(BuildContext context) {
    final steps = [
      ('pending', 'Ordered'),
      ('confirmed', 'Confirmed'),
      ('packing', 'Packing'),
      ('out_for_delivery', 'Pickup'),
      ('delivered', 'Delivered'),
    ];
    final activeIndex = steps.indexWhere((step) => step.$1 == status);
    return Column(
      children: [
        Row(
          children: steps.map((step) {
            final done = activeIndex >= steps.indexOf(step);
            return Expanded(
              child: Container(
                height: 6,
                margin: const EdgeInsets.only(right: 4),
                decoration: BoxDecoration(
                  color: status == 'cancelled'
                      ? Colors.red.shade200
                      : done
                      ? Colors.teal
                      : Colors.grey.shade200,
                  borderRadius: BorderRadius.circular(999),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 8),
        Row(
          children: steps.map((step) {
            final done = activeIndex >= steps.indexOf(step);
            return Expanded(
              child: Text(
                step.$2,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 10,
                  color: done ? Colors.teal.shade800 : Colors.grey,
                  fontWeight: done ? FontWeight.w800 : FontWeight.w500,
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}

class _OrderMedicineTile extends StatelessWidget {
  const _OrderMedicineTile({
    required this.medicine,
    required this.onAdd,
    required this.onView,
  });
  final Map<String, dynamic> medicine;
  final VoidCallback onAdd;
  final VoidCallback onView;

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: .96, end: 1),
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeOut,
      builder: (context, scale, child) =>
          Transform.scale(scale: scale, child: child),
      child: _Card(
        child: InkWell(
          onTap: onView,
          borderRadius: BorderRadius.circular(14),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: Colors.teal.shade50,
                foregroundColor: Colors.teal,
                child: const Icon(Icons.medication_liquid),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      text(medicine['name']),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                    Text(
                      '${text(medicine['generic'])} . Stock ${number(medicine['stock']).toInt()}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (medicine['prescription_required'] == true)
                      Text(
                        'Prescription required',
                        style: TextStyle(
                          color: Colors.orange.shade800,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'BDT ${money(number(medicine['price']))}',
                    style: const TextStyle(fontWeight: FontWeight.w900),
                  ),
                  TextButton.icon(
                    onPressed: onAdd,
                    icon: const Icon(Icons.add_shopping_cart),
                    label: const Text('Add'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MedicineTile extends StatelessWidget {
  const _MedicineTile({required this.medicine, this.detailed = false});
  final Map<String, dynamic> medicine;
  final bool detailed;

  @override
  Widget build(BuildContext context) {
    final stock = number(medicine['stock']);
    final reorder = number(medicine['reorder']);
    final status = text(medicine['status']);
    final danger = status == 'expired' || stock <= reorder;
    return _Card(
      child: ListTile(
        contentPadding: EdgeInsets.zero,
        leading: CircleAvatar(
          backgroundColor: danger ? Colors.red.shade50 : Colors.teal.shade50,
          foregroundColor: danger ? Colors.red : Colors.teal,
          child: const Icon(Icons.medication),
        ),
        title: Text(
          text(medicine['name']),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
        subtitle: Text(
          detailed
              ? '${text(medicine['generic'])} . ${text(medicine['category'])}\nBatch ${text(medicine['batch'])} . Exp ${text(medicine['expiry'])}'
              : '${text(medicine['category'])} . stock ${stock.toInt()}',
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              'BDT ${money(number(medicine['price']))}',
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
            Text(stock <= reorder ? 'Reorder' : status),
          ],
        ),
      ),
    );
  }
}

class _CustomerTile extends StatelessWidget {
  const _CustomerTile({required this.customer});
  final Map<String, dynamic> customer;

  @override
  Widget build(BuildContext context) {
    return _Card(
      child: ListTile(
        contentPadding: EdgeInsets.zero,
        leading: CircleAvatar(child: Text(initials(text(customer['name'])))),
        title: Text(
          text(customer['name']),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
        subtitle: Text(
          '${text(customer['phone'])}\nVisits ${number(customer['visits']).toInt()} . Points ${number(customer['loyalty_points']).toInt()}',
        ),
        trailing: Text(
          'BDT ${money(number(customer['total_purchases']))}',
          textAlign: TextAlign.right,
        ),
      ),
    );
  }
}

class _SaleTile extends StatelessWidget {
  const _SaleTile({required this.sale});
  final Map<String, dynamic> sale;

  @override
  Widget build(BuildContext context) {
    return _Card(
      child: ListTile(
        contentPadding: EdgeInsets.zero,
        leading: const CircleAvatar(child: Icon(Icons.receipt_long)),
        title: Text(
          text(sale['id']),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
        subtitle: Text('${text(sale['customer'])} . ${text(sale['date'])}'),
        trailing: Text(
          'BDT ${money(number(sale['total']))}',
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  const _InfoTile({
    required this.title,
    required this.subtitle,
    required this.icon,
  });
  final String title;
  final String subtitle;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return _Card(
      child: ListTile(
        contentPadding: EdgeInsets.zero,
        leading: CircleAvatar(child: Icon(icon)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
        subtitle: Text(subtitle),
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  const _SummaryRow({
    required this.label,
    required this.value,
    required this.icon,
  });
  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return _Card(
      child: Row(
        children: [
          CircleAvatar(child: Icon(icon)),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
          Text(
            value,
            style: Theme.of(context).textTheme.titleLarge
                ?.copyWith(fontWeight: FontWeight.w900),
          ),
        ],
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.label,
    required this.value,
    required this.sub,
    required this.icon,
  });
  final String label;
  final String value;
  final String sub;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return _Card(
      margin: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            backgroundColor: Colors.teal.shade50,
            foregroundColor: Colors.teal,
            child: Icon(icon),
          ),
          const Spacer(),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.headlineSmall
                ?.copyWith(fontWeight: FontWeight.w900),
          ),
          Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
          Text(
            sub,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
    );
  }
}

class _CustomerGradientSurface extends StatelessWidget {
  const _CustomerGradientSurface({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFFEAFBF7), Color(0xFFF7F8FF), Color(0xFFFFFFFF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: child,
    );
  }
}

class _ServiceBadge extends StatelessWidget {
  const _ServiceBadge({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 72,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE1F2EF)),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF0F8F83)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroPanel extends StatelessWidget {
  const _HeroPanel({
    required this.title,
    required this.subtitle,
    required this.icon,
    this.trailing,
  });
  final String title;
  final String subtitle;
  final IconData icon;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0B7F79), Color(0xFF13B79A), Color(0xFF4F8DF7)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [
          BoxShadow(
            color: Color(0x3313B79A),
            blurRadius: 24,
            offset: Offset(0, 12),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: Colors.white,
            foregroundColor: const Color(0xFF0F8F83),
            child: Icon(icon),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                Text(subtitle, style: const TextStyle(color: Colors.white70)),
              ],
            ),
          ),
          ?trailing,
        ],
      ),
    );
  }
}

class _Card extends StatelessWidget {
  const _Card({
    required this.child,
    this.margin = const EdgeInsets.only(bottom: 10),
  });
  final Widget child;
  final EdgeInsetsGeometry margin;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: .94),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: .85)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x120F8F83),
            blurRadius: 22,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: child,
    );
  }
}

class _BrandHeader extends StatelessWidget {
  const _BrandHeader({this.light = false});
  final bool light;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 58,
          height: 58,
          decoration: BoxDecoration(
            color: light ? Colors.white : const Color(0xFF0F8F83),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Icon(
            Icons.local_pharmacy,
            color: light ? const Color(0xFF0F8F83) : Colors.white,
            size: 32,
          ),
        ),
        const SizedBox(width: 14),
        Text(
          'MNEX Pharma',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.w900,
            color: light ? Colors.white : null,
          ),
        ),
      ],
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.title);
  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium
            ?.copyWith(fontWeight: FontWeight.w900),
      ),
    );
  }
}

class _SummaryLine extends StatelessWidget {
  const _SummaryLine({
    required this.label,
    required this.value,
    this.strong = false,
  });
  final String label;
  final String value;
  final bool strong;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            label,
            style: TextStyle(
              fontWeight: strong ? FontWeight.w800 : FontWeight.w500,
            ),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontWeight: strong ? FontWeight.w900 : FontWeight.w700,
          ),
        ),
      ],
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red.shade100),
      ),
      child: Text(message, style: TextStyle(color: Colors.red.shade800)),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 22),
      child: Center(
        child: Text(message, style: Theme.of(context).textTheme.bodyMedium),
      ),
    );
  }
}

class FutureView<T> extends StatelessWidget {
  const FutureView({super.key, required this.future, required this.builder});
  final Future<T> future;
  final Widget Function(T data) builder;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<T>(
      future: future,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const SizedBox(height: 80),
              Icon(Icons.cloud_off, size: 56, color: Colors.red.shade300),
              const SizedBox(height: 16),
              Text(
                'Could not load data',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(snapshot.error.toString(), textAlign: TextAlign.center),
              const SizedBox(height: 8),
              Text(
                'Make sure the backend is running on ${ApiClient.baseUrl}',
                textAlign: TextAlign.center,
              ),
            ],
          );
        }
        return builder(snapshot.data as T);
      },
    );
  }
}

IconData _statIcon(int index) {
  const icons = [
    Icons.medication,
    Icons.shopping_cart,
    Icons.payments,
    Icons.warning_amber,
    Icons.cancel,
    Icons.local_shipping,
  ];
  return icons[index % icons.length];
}

List<Map<String, dynamic>> asList(dynamic value) {
  if (value is List) {
    return value.map((item) => asMap(item)).toList();
  }
  return const [];
}

Map<String, dynamic> asMap(dynamic value) {
  if (value is Map<String, dynamic>) return value;
  if (value is Map) {
    return value.map((key, val) => MapEntry(key.toString(), val));
  }
  return <String, dynamic>{};
}

String text(dynamic value) => value?.toString() ?? '';

double number(dynamic value) {
  if (value is num) return value.toDouble();
  return double.tryParse(value?.toString() ?? '') ?? 0;
}

String money(double value) => NumberFormat('#,##0.00').format(value);

String formatBytes(int bytes) {
  if (bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
  return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
}

String prettyDateTime(String value) {
  if (value.isEmpty) return '';
  final parsed = DateTime.tryParse(value);
  if (parsed == null) return value;
  return DateFormat('MMM d, h:mm a').format(parsed.toLocal());
}

String orderStatusLabel(String status) {
  return switch (status) {
    'pending' => 'Pending',
    'confirmed' => 'Confirmed',
    'packing' => 'Packing',
    'out_for_delivery' => 'Out for delivery',
    'delivered' => 'Delivered',
    'cancelled' => 'Cancelled',
    _ => status.isEmpty ? 'Pending' : status,
  };
}

Color statusColor(String status) {
  return switch (status) {
    'pending' => Colors.orange,
    'confirmed' => Colors.blue,
    'packing' => Colors.purple,
    'out_for_delivery' => Colors.indigo,
    'delivered' => Colors.green,
    'cancelled' => Colors.red,
    _ => Colors.grey,
  };
}

String prescriptionReviewLabel(String status) {
  return switch (status) {
    'approved' => 'Prescription approved',
    'rejected' => 'Prescription rejected',
    'not_required' => 'No review needed',
    _ => 'Prescription review pending',
  };
}

IconData prescriptionReviewIcon(String status) {
  return switch (status) {
    'approved' => Icons.verified_outlined,
    'rejected' => Icons.report_gmailerrorred_outlined,
    'not_required' => Icons.check_circle_outline,
    _ => Icons.hourglass_empty,
  };
}

Color prescriptionReviewColor(String status) {
  return switch (status) {
    'approved' => Colors.green,
    'rejected' => Colors.red,
    'not_required' => Colors.teal,
    _ => Colors.orange,
  };
}

String initials(String name) {
  final parts = name
      .trim()
      .split(RegExp(r'\s+'))
      .where((part) => part.isNotEmpty)
      .toList();
  if (parts.isEmpty) return 'AU';
  return parts.take(2).map((part) => part[0].toUpperCase()).join();
}

extension FirstOrNull<T> on Iterable<T> {
  T? get firstOrNull => isEmpty ? null : first;
}
