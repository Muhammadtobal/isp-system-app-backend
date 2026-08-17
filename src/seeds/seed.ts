import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AppModule } from 'src/app.module';

import { User } from 'src/user/entities/user.entity';
import { Network } from 'src/network/entities/network.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeNetwork } from 'src/employee-network/entities/employee-network.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { ExpenseType } from 'src/expense_type/entities/expense_type.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Point } from 'src/point/entities/point.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Alert } from 'src/alert/entities/alert.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { Product } from 'src/product/entities/product.entity';
import { Sold } from 'src/sold/entities/sold.entity';

import { RadiusService } from 'src/radius/radius.service';
import { Role } from 'src/shared/enums/role.enum';
import { ServiceType } from 'src/shared/enums/service_type.enum';

const COUNT = 20;
const USER_COUNT = 2;

const NETWORKS_PER_USER = 3;
const EMPLOYEES_PER_USER = Math.ceil(COUNT / USER_COUNT);
const CUSTOMERS_PER_USER = Math.ceil(COUNT / USER_COUNT);

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);
  const radiusService = app.get(RadiusService);

  const userRepository = dataSource.getRepository(User);
  const networkRepository = dataSource.getRepository(Network);
  const employeeRepository = dataSource.getRepository(Employee);
  const employeeNetworkRepository = dataSource.getRepository(EmployeeNetwork);
  const customerRepository = dataSource.getRepository(Customer);
  const expenseTypeRepository = dataSource.getRepository(ExpenseType);
  const planRepository = dataSource.getRepository(Plan);
  const pointRepository = dataSource.getRepository(Point);
  const subscriptionRepository = dataSource.getRepository(Subscription);
  const paymentRepository = dataSource.getRepository(Payment);
  const alertRepository = dataSource.getRepository(Alert);
  const expenseRepository = dataSource.getRepository(Expense);
  const productRepository = dataSource.getRepository(Product);
  const soldRepository = dataSource.getRepository(Sold);

  try {
    console.log('======================================');
    console.log('🌱 Starting database seed...');
    console.log(`📦 Creating ${COUNT} records and ${USER_COUNT} users`);
    console.log('======================================');

    // =========================================================
    // 1. USERS
    // =========================================================

    console.log('\n👤 إنشاء المستخدمين...');

    const users: User[] = [];

    const passwordHash = await bcrypt.hash('Password@123456', 10);

    for (let i = 1; i <= USER_COUNT; i++) {
      const email = `user${i}@example.com`;

      let user = await userRepository.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        user = userRepository.create({
          name: `مستخدم تجريبي ${i}`,
          description: `رقم المستخدم التجريبي ${i}`,
          email,
          password: passwordHash,
          phone: `+966500000${String(i).padStart(3, '0')}`,
          address: `الرياض، المملكة العربية السعودية - الشارع ${i}`,
          role: i === 1 ? Role.ADMIN : Role.USER,
          active: true,
        });

        user = await userRepository.save(user);
      } else {
        // تأكيد أن البيانات الأساسية صحيحة عند إعادة تشغيل الـ seed
        user.name = `مستخدم تجريبي ${i}`;
        user.description = `رقم المستخدم التجريبي ${i}`;
        user.active = true;

        user = await userRepository.save(user);
      }

      users.push(user);
    }

    console.log(`✅ Users: ${users.length}`);

    // =========================================================
    // 2. NETWORKS
    //
    // القاعدة:
    // Network.user_id = مالك الشبكة
    // وكل شيء تابع للشبكة سيأخذ هذا الـ user_id
    // =========================================================

    console.log('\n🌐 إنشاء الشبكات...');

    const networks: Network[] = [];
    const networksByUser = new Map<number, Network[]>();

    for (const user of users) {
      const userNetworks: Network[] = [];

      for (let i = 1; i <= NETWORKS_PER_USER; i++) {
        const name = `شبكة تجريبية ${i}`;

        let network = await networkRepository.findOne({
          where: {
            name,
            user_id: user.id,
          },
        });

        if (!network) {
          network = networkRepository.create({
            name,
            user_id: user.id,
            active: true,
          });
        } else {
          network.user_id = user.id;
          network.active = true;
        }

        network = await networkRepository.save(network);

        networks.push(network);
        userNetworks.push(network);
      }

      networksByUser.set(user.id, userNetworks);
    }

    console.log(`✅ Networks: ${networks.length}`);

    // =========================================================
    // 3. EMPLOYEES
    //
    // الموظف تابع لـ User.
    // =========================================================

    console.log('\n👨‍💼 إنشاء الموظفين...');

    const employees: Employee[] = [];
    const employeesByUser = new Map<number, Employee[]>();

    let employeeGlobalIndex = 1;

    for (const user of users) {
      const userEmployees: Employee[] = [];

      for (let i = 1; i <= EMPLOYEES_PER_USER; i++) {
        if (employeeGlobalIndex > COUNT) {
          break;
        }

        const email = `employee${employeeGlobalIndex}@example.com`;

        let employee = await employeeRepository.findOne({
          where: {
            email,
          },
        });

        if (!employee) {
          employee = employeeRepository.create({
            email,
            full_name: `موظف تجريبي ${employeeGlobalIndex}`,
            password: passwordHash,
            user_id: user.id,
            active: true,
          });
        } else {
          // إصلاح المالك إذا كان seed سابقاً قد وضع user مختلف
          employee.user_id = user.id;
          employee.full_name = `موظف تجريبي ${employeeGlobalIndex}`;
          employee.active = true;
        }

        employee = await employeeRepository.save(employee);

        employees.push(employee);
        userEmployees.push(employee);

        employeeGlobalIndex++;
      }

      employeesByUser.set(user.id, userEmployees);
    }

    console.log(`✅ Employees: ${employees.length}`);

    // =========================================================
    // 4. EMPLOYEE NETWORK
    //
    // Employee و Network يجب أن يكونا تحت نفس User.
    // =========================================================

    console.log('\n🔗 إنشاء شبكات الموظفين...');

    const employeeNetworks: EmployeeNetwork[] = [];

    for (const user of users) {
      const userNetworks = networksByUser.get(user.id) ?? [];
      const userEmployees = employeesByUser.get(user.id) ?? [];

      if (!userNetworks.length) {
        throw new Error(`No networks found for user ${user.id}`);
      }

      for (let i = 0; i < userEmployees.length; i++) {
        const employee = userEmployees[i];
        const network = userNetworks[i % userNetworks.length];

        let employeeNetwork = await employeeNetworkRepository.findOne({
          where: {
            employee_id: employee.id,
            network_id: network.id,
          },
        });

        if (!employeeNetwork) {
          employeeNetwork = employeeNetworkRepository.create({
            employee_id: employee.id,
            network_id: network.id,
            user_id: user.id,
            active: true,
          });
        } else {
          employeeNetwork.user_id = user.id;
          employeeNetwork.active = true;
        }

        employeeNetwork = await employeeNetworkRepository.save(employeeNetwork);

        employeeNetworks.push(employeeNetwork);
      }
    }

    console.log(`✅ Employee Networks: ${employeeNetworks.length}`);

    // =========================================================
    // 5. EXPENSE TYPES
    //
    // ExpenseType تابع لـ User وليس Network.
    // =========================================================

    console.log('\n💰 إنشاء أنواع المصاريف...');

    const expenseTypes: ExpenseType[] = [];

    const expenseNames = [
      'الإنترنت',
      'الصيانة',
      'الكهرباء',
      'الإيجار',
      'المواصلات',
      'المعدات',
      'البرمجيات',
      'الخادم',
      'التسويق',
      'المكتب',
      'الوقود',
      'التركيب',
      'الإصلاح',
      'الأمان',
      'الدعم',
      'التنظيف',
      'الهاتف',
      'الاستضافة',
      'الأجهزة',
      'أخرى',
    ];

    for (const user of users) {
      for (let i = 0; i < expenseNames.length; i++) {
        const name = expenseNames[i];

        let expenseType = await expenseTypeRepository.findOne({
          where: {
            name,
            user_id: user.id,
          },
        });

        if (!expenseType) {
          expenseType = expenseTypeRepository.create({
            name,
            user_id: user.id,
            active: true,
          });
        } else {
          expenseType.user_id = user.id;
          expenseType.active = true;
        }

        expenseType = await expenseTypeRepository.save(expenseType);

        expenseTypes.push(expenseType);
      }
    }

    console.log(`✅ Expense Types: ${expenseTypes.length}`);

    // =========================================================
    // 6. CUSTOMERS
    //
    // Customer تابع لـ Network.
    //
    // لذلك:
    // customer.network_id = network.id
    // customer.user_id = network.user_id
    // =========================================================

    console.log('\n👥 إنشاء العملاء...');

    const customers: Customer[] = [];
    const customersByNetwork = new Map<number, Customer[]>();

    let customerGlobalIndex = 1;

    for (const user of users) {
      const userNetworks = networksByUser.get(user.id) ?? [];

      for (let i = 0; i < CUSTOMERS_PER_USER; i++) {
        if (customerGlobalIndex > COUNT) {
          break;
        }

        const network = userNetworks[i % userNetworks.length];

        if (!network) {
          throw new Error(
            `Network for customer ${customerGlobalIndex} is undefined`,
          );
        }

        const phone = `+966511000${String(customerGlobalIndex).padStart(
          4,
          '0',
        )}`;

        let customer = await customerRepository.findOne({
          where: {
            phone,
          },
        });

        if (!customer) {
          customer = customerRepository.create({
            name: `عميل ${customerGlobalIndex}`,
            phone,
            network_id: network.id,
            user_id: network.user_id,
            active: true,
          });
        } else {
          // تصحيح العلاقات القديمة
          customer.network_id = network.id;
          customer.user_id = network.user_id;
          customer.name = `عميل ${customerGlobalIndex}`;
          customer.active = true;
        }

        customer = await customerRepository.save(customer);

        customers.push(customer);

        const networkCustomers = customersByNetwork.get(network.id) ?? [];

        networkCustomers.push(customer);
        customersByNetwork.set(network.id, networkCustomers);

        customerGlobalIndex++;
      }
    }

    console.log(`✅ Customers: ${customers.length}`);

    // =========================================================
    // 7. PLANS
    //
    // كل Network عندها 3 Plans.
    //
    // Plan.user_id = Network.user_id
    // Plan.network_id = Network.id
    // =========================================================

    console.log('\n📡 إنشاء الباقات...');

    const plans: Plan[] = [];
    const plansByNetwork = new Map<number, Plan[]>();

    const serviceTypes = [
      ServiceType.PPPOE,
      ServiceType.HOTSPOT,
      ServiceType.GROUP,
    ];

    const serviceTypeNames = {
      [ServiceType.PPPOE]: 'بروتوكول PPPoE',
      [ServiceType.HOTSPOT]: 'نقطة اتصال',
      [ServiceType.GROUP]: 'مجموعة',
    };

    for (const network of networks) {
      const ownerId = network.user_id;

      const owner = users.find((user) => user.id === ownerId);

      if (!owner) {
        throw new Error(`Owner for network ${network.id} is undefined`);
      }

      const networkPlans: Plan[] = [];

      for (let j = 0; j < serviceTypes.length; j++) {
        const serviceType = serviceTypes[j];

        const name = `باقة ${serviceTypeNames[serviceType]} - ${network.name}`;

        let plan = await planRepository.findOne({
          where: {
            name,
            network_id: network.id,
          },
        });

        if (!plan) {
          plan = planRepository.create({
            name,
            price: 50 + (j + 1) * 25,
            network_id: network.id,
            user_id: network.user_id,
            service_type: serviceType,
            download_speed: 20 + (j + 1) * 10,
            upload_speed: 5 + (j + 1) * 5,
            active: true,
          });
        } else {
          // تصحيح العلاقات
          plan.network_id = network.id;
          plan.user_id = network.user_id;
          plan.service_type = serviceType;
          plan.price = 50 + (j + 1) * 25;
          plan.download_speed = 20 + (j + 1) * 10;
          plan.upload_speed = 5 + (j + 1) * 5;
          plan.active = true;
        }

        plan = await planRepository.save(plan);

        plans.push(plan);
        networkPlans.push(plan);
      }

      plansByNetwork.set(network.id, networkPlans);
    }

    console.log(`✅ Plans: ${plans.length}`);

    // =========================================================
    // 8. POINTS
    //
    // Point تابع لـ Network.
    // =========================================================

    // =========================================================
    // 8. POINTS
    //
    // كل Network يجب أن يكون لها Points.
    // Point.user_id = Network.user_id
    // Point.network_id = Network.id
    // =========================================================

    console.log('\n📍 إنشاء النقاط...');

    const points: Point[] = [];
    const pointsByNetwork = new Map<number, Point[]>();

    let pointGlobalIndex = 1;

    for (const network of networks) {
      const networkPoints: Point[] = [];

      // عدد النقاط لكل شبكة
      // نضمن على الأقل نقطة واحدة لكل Network
      const pointsForThisNetwork = Math.max(
        1,
        Math.ceil(COUNT / networks.length),
      );

      for (let j = 0; j < pointsForThisNetwork; j++) {
        const name = `العلبة ${pointGlobalIndex}`;

        let point = await pointRepository.findOne({
          where: {
            name,
            network_id: network.id,
          },
        });

        if (!point) {
          point = pointRepository.create({
            name,

            // مهم جداً
            network_id: network.id,

            // مالك الـ Network هو مالك الـ Point
            user_id: network.user_id,

            max_subscription: 50 + pointGlobalIndex * 5,

            count_subscription: 0,

            notes: `رقم العلبة التجريبية ${pointGlobalIndex}`,

            location: {
              latitude: 24.7136 + pointGlobalIndex * 0.01,

              longitude: 46.6753 + pointGlobalIndex * 0.01,
            },

            active: true,
          });
        } else {
          // تصحيح أي بيانات قديمة
          point.network_id = network.id;
          point.user_id = network.user_id;

          point.max_subscription = 50 + pointGlobalIndex * 5;

          point.notes = `رقم العلبة التجريبية ${pointGlobalIndex}`;

          point.active = true;
        }

        point = await pointRepository.save(point);

        points.push(point);
        networkPoints.push(point);

        pointGlobalIndex++;
      }

      // مهم جداً:
      // كل Network لازم يكون لها Points
      if (networkPoints.length === 0) {
        throw new Error(`Network ${network.id} has no points`);
      }

      pointsByNetwork.set(network.id, networkPoints);

      console.log(
        `   ↳ Network ${network.id} → ${networkPoints.length} Points`,
      );
    }

    console.log(`✅ Points: ${points.length}`);
    // =========================================================
    // 9. SUBSCRIPTIONS
    //
    // هنا أهم جزء:
    //
    // نبدأ من Customer.
    // Customer -> Network
    // ثم نأخذ Plan و Point من نفس Network.
    //
    // وبالتالي مستحيل:
    //
    // customer.network_id = 3
    // plan.network_id = 4
    // point.network_id = 5
    //
    // =========================================================

    console.log('\n📋 إنشاء الاشتراكات...');

    const subscriptions: Subscription[] = [];

    for (let i = 0; i < customers.length && i < COUNT; i++) {
      const customer = customers[i];

      const network = networks.find((item) => item.id === customer.network_id);

      if (!network) {
        throw new Error(
          `Network ${customer.network_id} for customer ${customer.id} is undefined`,
        );
      }

      // تأكيد أن Customer و Network لهما نفس الـ owner
      if (customer.user_id !== network.user_id) {
        throw new Error(
          `Invalid relation: Customer ${customer.id} belongs to user ${customer.user_id}, but Network ${network.id} belongs to user ${network.user_id}`,
        );
      }

      const networkPlans = plansByNetwork.get(network.id) ?? [];

      const networkPoints = pointsByNetwork.get(network.id) ?? [];

      if (!networkPlans.length) {
        throw new Error(`No plans found for network ${network.id}`);
      }

      if (!networkPoints.length) {
        throw new Error(`No points found for network ${network.id}`);
      }

      const plan = networkPlans[i % networkPlans.length];

      const point = networkPoints[i % networkPoints.length];

      /*
       * تحقق إضافي قبل إنشاء Subscription
       */
      if (plan.network_id !== network.id) {
        throw new Error(
          `Plan ${plan.id} does not belong to network ${network.id}`,
        );
      }

      if (point.network_id !== network.id) {
        throw new Error(
          `Point ${point.id} does not belong to network ${network.id}`,
        );
      }

      let subscription = await subscriptionRepository.findOne({
        where: {
          customer_id: customer.id,
          plan_id: plan.id,
        },
      });

      if (!subscription) {
        // ==========================================
        // RADIUS USER
        // ==========================================

        const radiusUsers = await radiusService.createRadiusUsers(
          {
            generateUsername: true,
            count: 1,

            // مهم جداً:
            // RADIUS user تابع لنفس Network
            network_id: network.id,

            checks: [],

            replies: [
              {
                attribute: 'Framed-Protocol',
                op: ':=',
                value: 'PPP',
              },
              {
                attribute: 'Service-Type',
                op: ':=',
                value: 'Framed-User',
              },
            ],
          },
          true,
        );

        const radiusUser = radiusUsers[0];

        if (!radiusUser) {
          throw new Error(
            `Failed to create PPPoE user for customer ${customer.id}`,
          );
        }

        // ==========================================
        // SUBSCRIPTION
        // ==========================================

        subscription = subscriptionRepository.create({
          customer_id: customer.id,

          plan_id: plan.id,

          point_id: point.id,

          network_id: network.id,

          radius_username: radiusUser.username,

          // لا نأخذ owner من index
          // نأخذه من Network
          user_id: network.user_id,

          location: {
            latitude: 24.7136 + (i + 1) * 0.01,
            longitude: 46.6753 + (i + 1) * 0.01,
          },

          active: true,
        });
      } else {
        /*
         * إذا كان Subscription موجود من seed قديم،
         * نصحح كل العلاقات.
         */
        subscription.customer_id = customer.id;
        subscription.plan_id = plan.id;
        subscription.point_id = point.id;
        subscription.network_id = network.id;
        subscription.user_id = network.user_id;
        subscription.active = true;
      }

      subscription = await subscriptionRepository.save(subscription);

      subscriptions.push(subscription);

      console.log(
        `   ↳ Subscription ${subscription.id}: ` +
          `User ${network.user_id} → Network ${network.id} → ` +
          `Customer ${customer.id} → Plan ${plan.id} → Point ${point.id}`,
      );
    }

    console.log(`✅ Subscriptions: ${subscriptions.length}`);

    // =========================================================
    // 10. PAYMENTS
    //
    // Payment تابع لـ Subscription.
    //
    // لذلك نأخذ:
    // network_id = subscription.network_id
    // user_id    = subscription.user_id
    // =========================================================

    console.log('\n💳 إنشاء الدفعات...');

    const payments: Payment[] = [];

    for (let i = 0; i < subscriptions.length; i++) {
      const subscription = subscriptions[i];

      let payment = await paymentRepository.findOne({
        where: {
          subscription_id: subscription.id,
        },
      });

      if (!payment) {
        payment = paymentRepository.create({
          subscription_id: subscription.id,

          amount: 50 + (i + 1) * 10,

          network_id: subscription.network_id,

          user_id: subscription.user_id,

          active: true,
        });
      } else {
        // تصحيح العلاقات من Subscription
        payment.subscription_id = subscription.id;

        payment.network_id = subscription.network_id;

        payment.user_id = subscription.user_id;

        payment.amount = 50 + (i + 1) * 10;

        payment.active = true;
      }

      payment = await paymentRepository.save(payment);

      payments.push(payment);
    }

    console.log(`✅ Payments: ${payments.length}`);

    // =========================================================
    // 11. ALERTS
    //
    // Alert تابع لـ Subscription.
    // =========================================================

    console.log('\n🚨 إنشاء التنبيهات...');

    const alerts: Alert[] = [];

    for (const subscription of subscriptions) {
      let alert = await alertRepository.findOne({
        where: {
          subscription_id: subscription.id,
        },
      });

      if (!alert) {
        alert = alertRepository.create({
          subscription_id: subscription.id,
          user_id: subscription.user_id,
          active: true,
        });
      } else {
        alert.subscription_id = subscription.id;

        alert.user_id = subscription.user_id!;

        alert.active = true;
      }

      alert = await alertRepository.save(alert);

      alerts.push(alert);
    }

    console.log(`✅ Alerts: ${alerts.length}`);

    // =========================================================
    // 12. EXPENSES
    //
    // Expense:
    //
    // Network -> User
    // Employee -> نفس User
    // ExpenseType -> نفس User
    //
    // =========================================================

    console.log('\n💸 إنشاء المصاريف...');

    const expenses: Expense[] = [];

    for (let i = 0; i < COUNT; i++) {
      const network = networks[i % networks.length];

      const user = users.find((item) => item.id === network.user_id);

      if (!user) {
        throw new Error(`Owner for network ${network.id} is undefined`);
      }

      const userEmployees = employeesByUser.get(user.id) ?? [];

      const userExpenseTypes = expenseTypes.filter(
        (expenseType) => expenseType.user_id === user.id,
      );

      if (!userEmployees.length) {
        throw new Error(`No employees found for user ${user.id}`);
      }

      if (!userExpenseTypes.length) {
        throw new Error(`No expense types found for user ${user.id}`);
      }

      const employee = userEmployees[i % userEmployees.length];

      const expenseType = userExpenseTypes[i % userExpenseTypes.length];

      /*
       * تحقق من العلاقات قبل الحفظ
       */
      if (employee.user_id !== network.user_id) {
        throw new Error(
          `Employee ${employee.id} does not belong to network owner ${network.user_id}`,
        );
      }

      if (expenseType.user_id !== network.user_id) {
        throw new Error(
          `ExpenseType ${expenseType.id} does not belong to network owner ${network.user_id}`,
        );
      }

      let expense = await expenseRepository.findOne({
        where: {
          network_id: network.id,
          expense_type_id: expenseType.id,
          employee_id: employee.id,
        },
      });

      if (!expense) {
        expense = expenseRepository.create({
          value: 100 + (i + 1) * 25,

          expense_type_id: expenseType.id,

          network_id: network.id,

          employee_id: employee.id,

          user_id: network.user_id,

          notes: `رقم المصروف التجريبي ${i + 1}`,

          active: true,
        });
      } else {
        expense.value = 100 + (i + 1) * 25;

        expense.expense_type_id = expenseType.id;

        expense.network_id = network.id;

        expense.employee_id = employee.id;

        expense.user_id = network.user_id;

        expense.notes = `رقم المصروف التجريبي ${i + 1}`;

        expense.active = true;
      }

      expense = await expenseRepository.save(expense);

      expenses.push(expense);
    }

    console.log(`✅ Expenses: ${expenses.length}`);

    // =========================================================
    // 13. PRODUCTS
    //
    // Product تابع مباشرة لـ User.
    // =========================================================

    console.log('\n📦 إنشاء المنتجات...');

    const products: Product[] = [];

    const productNames = [
      'جهاز توجيه تي بي لينك',
      'جهاز توجيه ميكروتيك',
      'نقطة وصول يوبيكويتي',
      'مبدّل شبكة',
      'كابل إيثرنت',
      'كابل ألياف ضوئية',
      'محوّل طاقة',
      'رف شبكات',
      'جهاز ONT',
      'جهاز ONU',
      'هوائي واي فاي',
      'موصل ألياف ضوئية',
      'وحدة SFP',
      'لوحة توزيع الشبكة',
      'مزود طاقة غير منقطع',
      'خزانة شبكات',
      'جهاز توجيه لاسلكي',
      'مودم',
      'نقطة وصول',
      'بطاقة شبكة',
    ];

    for (let i = 0; i < COUNT; i++) {
      const user = users[i % users.length];

      const name = productNames[i];

      let product = await productRepository.findOne({
        where: {
          name,
          user_id: user.id,
        },
      });

      if (!product) {
        product = productRepository.create({
          name,

          price: 50 + (i + 1) * 20,

          user_id: user.id,

          active: true,
        });
      } else {
        product.user_id = user.id;
        product.price = 50 + (i + 1) * 20;
        product.active = true;
      }

      product = await productRepository.save(product);

      products.push(product);
    }

    console.log(`✅ Products: ${products.length}`);

    // =========================================================
    // 14. SOLD
    //
    // Sold تابع لـ Product.
    // لذلك user_id لازم يكون نفس Product.user_id.
    // =========================================================

    console.log('\n🛒 إنشاء المبيعات...');

    const sales: Sold[] = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      let sale = await soldRepository.findOne({
        where: {
          product_id: product.id,
          user_id: product.user_id,
        },
      });

      const amount = (i % 5) + 1;
      const value = product.price * amount;

      if (!sale) {
        sale = soldRepository.create({
          product_id: product.id,

          user_id: product.user_id,

          amount,

          value,

          unit: 'قطعة',

          active: true,
        });
      } else {
        sale.product_id = product.id;
        sale.user_id = product.user_id;
        sale.amount = amount;
        sale.value = value;
        sale.unit = 'قطعة';
        sale.active = true;
      }

      sale = await soldRepository.save(sale);

      sales.push(sale);
    }

    console.log(`✅ Sales: ${sales.length}`);

    // =========================================================
    // 15. UPDATE POINT SUBSCRIPTION COUNTS
    // =========================================================

    console.log('\n🔄 تحديث أعداد الاشتراكات للنقاط...');

    for (const point of points) {
      const count = await subscriptionRepository.count({
        where: {
          point_id: point.id,
        },
      });

      await pointRepository.update(point.id, {
        count_subscription: count,
      });
    }

    console.log('✅ تم تحديث أعداد الاشتراكات للنقاط');

    // =========================================================
    // 16. RELATION VALIDATION
    //
    // فحص نهائي حتى نتأكد أن الـ seed ما أنشأ
    // علاقات متناقضة.
    // =========================================================

    console.log('\n🔍 فحص العلاقات...');

    // ---------------------------------------------------------
    // Validate Customers
    // ---------------------------------------------------------

    for (const customer of customers) {
      const network = networks.find((item) => item.id === customer.network_id);

      if (!network) {
        throw new Error(`❌ Customer ${customer.id}: Network not found`);
      }

      if (customer.user_id !== network.user_id) {
        throw new Error(
          `❌ Customer ${customer.id}: user_id=${customer.user_id} != Network ${network.id} owner=${network.user_id}`,
        );
      }
    }

    // ---------------------------------------------------------
    // Validate Plans
    // ---------------------------------------------------------

    for (const plan of plans) {
      const network = networks.find((item) => item.id === plan.network_id);

      if (!network) {
        throw new Error(`❌ Plan ${plan.id}: Network not found`);
      }

      if (plan.user_id !== network.user_id) {
        throw new Error(
          `❌ Plan ${plan.id}: user_id=${plan.user_id} != Network owner=${network.user_id}`,
        );
      }
    }

    // ---------------------------------------------------------
    // Validate Points
    // ---------------------------------------------------------

    for (const point of points) {
      const network = networks.find((item) => item.id === point.network_id);

      if (!network) {
        throw new Error(`❌ Point ${point.id}: Network not found`);
      }

      if (point.user_id !== network.user_id) {
        throw new Error(
          `❌ Point ${point.id}: user_id=${point.user_id} != Network owner=${network.user_id}`,
        );
      }
    }

    // ---------------------------------------------------------
    // Validate Subscriptions
    // ---------------------------------------------------------

    for (const subscription of subscriptions) {
      const customer = customers.find(
        (item) => item.id === subscription.customer_id,
      );

      const plan = plans.find((item) => item.id === subscription.plan_id);

      const point = points.find((item) => item.id === subscription.point_id);

      const network = networks.find(
        (item) => item.id === subscription.network_id,
      );

      if (!customer) {
        throw new Error(
          `❌ Subscription ${subscription.id}: Customer not found`,
        );
      }

      if (!plan) {
        throw new Error(`❌ Subscription ${subscription.id}: Plan not found`);
      }

      if (!point) {
        throw new Error(`❌ Subscription ${subscription.id}: Point not found`);
      }

      if (!network) {
        throw new Error(
          `❌ Subscription ${subscription.id}: Network not found`,
        );
      }

      // Customer يجب أن يكون على نفس Network
      if (customer.network_id !== network.id) {
        throw new Error(
          `❌ Subscription ${subscription.id}: Customer ${customer.id} belongs to Network ${customer.network_id}, expected ${network.id}`,
        );
      }

      // Plan يجب أن يكون على نفس Network
      if (plan.network_id !== network.id) {
        throw new Error(
          `❌ Subscription ${subscription.id}: Plan ${plan.id} belongs to Network ${plan.network_id}, expected ${network.id}`,
        );
      }

      // Point يجب أن يكون على نفس Network
      if (point.network_id !== network.id) {
        throw new Error(
          `❌ Subscription ${subscription.id}: Point ${point.id} belongs to Network ${point.network_id}, expected ${network.id}`,
        );
      }

      // User يجب أن يكون مالك Network
      if (subscription.user_id !== network.user_id) {
        throw new Error(
          `❌ Subscription ${subscription.id}: user_id=${subscription.user_id} != Network owner=${network.user_id}`,
        );
      }

      // Customer user يجب أن يطابق Network owner
      if (customer.user_id !== network.user_id) {
        throw new Error(
          `❌ Subscription ${subscription.id}: Customer owner mismatch`,
        );
      }

      // Plan user يجب أن يطابق Network owner
      if (plan.user_id !== network.user_id) {
        throw new Error(
          `❌ Subscription ${subscription.id}: Plan owner mismatch`,
        );
      }

      // Point user يجب أن يطابق Network owner
      if (point.user_id !== network.user_id) {
        throw new Error(
          `❌ Subscription ${subscription.id}: Point owner mismatch`,
        );
      }
    }

    // ---------------------------------------------------------
    // Validate Payments
    // ---------------------------------------------------------

    for (const payment of payments) {
      const subscription = subscriptions.find(
        (item) => item.id === payment.subscription_id,
      );

      if (!subscription) {
        throw new Error(`❌ Payment ${payment.id}: Subscription not found`);
      }

      if (payment.network_id !== subscription.network_id) {
        throw new Error(`❌ Payment ${payment.id}: Network mismatch`);
      }

      if (payment.user_id !== subscription.user_id) {
        throw new Error(`❌ Payment ${payment.id}: User mismatch`);
      }
    }

    // ---------------------------------------------------------
    // Validate Employee Networks
    // ---------------------------------------------------------

    for (const employeeNetwork of employeeNetworks) {
      const employee = employees.find(
        (item) => item.id === employeeNetwork.employee_id,
      );

      const network = networks.find(
        (item) => item.id === employeeNetwork.network_id,
      );

      if (!employee) {
        throw new Error(
          `❌ EmployeeNetwork ${employeeNetwork.id}: Employee not found`,
        );
      }

      if (!network) {
        throw new Error(
          `❌ EmployeeNetwork ${employeeNetwork.id}: Network not found`,
        );
      }

      if (employee.user_id !== network.user_id) {
        throw new Error(
          `❌ EmployeeNetwork ${employeeNetwork.id}: Employee and Network have different owners`,
        );
      }

      if (employeeNetwork.user_id !== network.user_id) {
        throw new Error(
          `❌ EmployeeNetwork ${employeeNetwork.id}: user_id mismatch`,
        );
      }
    }

    // ---------------------------------------------------------
    // Validate Expenses
    // ---------------------------------------------------------

    for (const expense of expenses) {
      const network = networks.find((item) => item.id === expense.network_id);

      const employee = employees.find(
        (item) => item.id === expense.employee_id,
      );

      const expenseType = expenseTypes.find(
        (item) => item.id === expense.expense_type_id,
      );

      if (!network) {
        throw new Error(`❌ Expense ${expense.id}: Network not found`);
      }

      if (!employee) {
        throw new Error(`❌ Expense ${expense.id}: Employee not found`);
      }

      if (!expenseType) {
        throw new Error(`❌ Expense ${expense.id}: ExpenseType not found`);
      }

      if (employee.user_id !== network.user_id) {
        throw new Error(`❌ Expense ${expense.id}: Employee owner mismatch`);
      }

      if (expenseType.user_id !== network.user_id) {
        throw new Error(`❌ Expense ${expense.id}: ExpenseType owner mismatch`);
      }

      if (expense.user_id !== network.user_id) {
        throw new Error(`❌ Expense ${expense.id}: User owner mismatch`);
      }
    }

    console.log('✅ جميع العلاقات صحيحة ومنطقية');

    // =========================================================
    // SUMMARY
    // =========================================================

    console.log('\n======================================');
    console.log('🌱 اكتملت تهيئة قاعدة البيانات');
    console.log('======================================');

    console.log(`👤 المستخدمون:              ${users.length}`);

    console.log(`🌐 Networks:               ${networks.length}`);

    console.log(`👨‍💼 الموظفون:               ${employees.length}`);

    console.log(`🔗 Employee Networks:      ${employeeNetworks.length}`);

    console.log(`💰 Expense Types:          ${expenseTypes.length}`);

    console.log(`👥 Customers:              ${customers.length}`);

    console.log(`📡 Plans:                  ${plans.length}`);

    console.log(`📍 Points:                 ${points.length}`);

    console.log(`📋 Subscriptions:          ${subscriptions.length}`);

    console.log(`💳 Payments:               ${payments.length}`);

    console.log(`🚨 Alerts:                 ${alerts.length}`);

    console.log(`💸 Expenses:               ${expenses.length}`);

    console.log(`📦 Products:               ${products.length}`);

    console.log(`🛒 Sales:                  ${sales.length}`);

    console.log('======================================');

    // =========================================================
    // LOGIN INFO
    // =========================================================

    console.log('\n🔐 بيانات تسجيل الدخول:');

    console.log('\nالمدير:');
    console.log('Email: user1@example.com');
    console.log('Password: Password@123456');

    console.log('\nالمستخدمون:');
    console.log('Email: user1@example.com ... user2@example.com');
    console.log('Password: Password@123456');

    console.log('\nالموظفون:');
    console.log('Email: employee1@example.com ... employee20@example.com');
    console.log('Password: Password@123456');

    console.log('\n======================================');
  } catch (error) {
    console.error('\n❌ فشلت تهيئة البيانات');

    console.error(error);

    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
