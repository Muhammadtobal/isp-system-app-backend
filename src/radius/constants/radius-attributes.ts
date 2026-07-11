export const RadiusCheckAttributes = [
  {
    attribute: 'Cleartext-Password',
    type: 'string',
    operators: [':=', '=', '=='],
    example: '123456',
    description: 'User password',
  },
  {
    attribute: 'Crypt-Password',
    type: 'string',
    operators: [':='],
    example: '$1$xxxxxx',
    description: 'Encrypted password',
  },
  {
    attribute: 'MD5-Password',
    type: 'string',
    operators: [':='],
    example: '5f4dcc3b5aa765d61d8327deb882cf99',
    description: 'MD5 password',
  },
  {
    attribute: 'SHA-Password',
    type: 'string',
    operators: [':='],
    example: 'sha1hash',
    description: 'SHA password',
  },
  {
    attribute: 'NT-Password',
    type: 'string',
    operators: [':='],
    example: 'hash',
    description: 'NT password',
  },
  {
    attribute: 'Password-With-Header',
    type: 'string',
    operators: [':='],
    example: '{clear}123456',
    description: 'Password with header',
  },
  {
    attribute: 'Auth-Type',
    type: 'string',
    operators: [':='],
    example: 'Reject',
    values: ['Accept', 'Reject', 'Local'],
    description: 'Authentication type',
  },
  {
    attribute: 'Simultaneous-Use',
    type: 'number',
    operators: [':='],
    example: 1,
    description: 'Maximum simultaneous sessions',
  },
  {
    attribute: 'Expiration',
    type: 'date',
    operators: [':='],
    example: '31 Dec 2026',
    description: 'Account expiration date',
  },
  {
    attribute: 'Login-Time',
    type: 'string',
    operators: [':='],
    example: 'Al0800-1800',
    description: 'Allowed login time',
  },
  {
    attribute: 'Max-All-Session',
    type: 'number',
    operators: [':='],
    example: 86400,
    description: 'Maximum accumulated session time',
  },
  {
    attribute: 'NAS-IP-Address',
    type: 'ip',
    operators: ['=='],
    example: '192.168.88.1',
    description: 'Allow only this NAS IP',
  },
  {
    attribute: 'NAS-Identifier',
    type: 'string',
    operators: ['=='],
    example: 'Mikrotik-1',
    description: 'NAS Identifier',
  },
  {
    attribute: 'NAS-Port',
    type: 'number',
    operators: ['=='],
    example: 0,
    description: 'NAS Port',
  },
  {
    attribute: 'NAS-Port-Type',
    type: 'string',
    operators: ['=='],
    example: 'Ethernet',
    description: 'NAS Port Type',
  },
  {
    attribute: 'Calling-Station-Id',
    type: 'string',
    operators: ['=='],
    example: 'AA:BB:CC:DD:EE:FF',
    description: 'Client MAC Address',
  },
  {
    attribute: 'Called-Station-Id',
    type: 'string',
    operators: ['=='],
    example: 'hotspot1',
    description: 'Hotspot Interface',
  },
  {
    attribute: 'Realm',
    type: 'string',
    operators: ['=='],
    example: 'isp.local',
    description: 'User realm',
  },
  {
    attribute: 'Service-Type',
    type: 'string',
    operators: ['=='],
    example: 'Framed-User',
    description: 'Service Type',
  },
  {
    attribute: 'Framed-Protocol',
    type: 'string',
    operators: ['=='],
    example: 'PPP',
    description: 'Framed Protocol',
  },
  {
    attribute: 'Huntgroup-Name',
    type: 'string',
    operators: ['=='],
    example: 'main',
    description: 'Hunt Group',
  },
];

export const RadiusReplyAttributes = [
  {
    attribute: 'Reply-Message',
    type: 'string',
    operators: [':=', '='],
    example: 'Welcome',
    description: 'Message sent to user',
  },
  {
    attribute: 'Session-Timeout',
    type: 'number',
    operators: [':=', '='],
    example: 3600,
    description: 'Maximum session time (seconds)',
  },
  {
    attribute: 'Idle-Timeout',
    type: 'number',
    operators: [':=', '='],
    example: 600,
    description: 'Disconnect if idle',
  },
  {
    attribute: 'Acct-Interim-Interval',
    type: 'number',
    operators: [':=', '='],
    example: 300,
    description: 'Accounting update interval',
  },
  {
    attribute: 'Termination-Action',
    type: 'string',
    operators: [':=', '='],
    example: 'RADIUS-Request',
    description: 'Action after session انتهاء',
  },

  // ======================
  // Bandwidth
  // ======================

  {
    attribute: 'Mikrotik-Rate-Limit',
    type: 'string',
    operators: [':=', '='],
    example: '20M/20M',
    description: 'Upload / Download speed',
  },
  {
    attribute: 'WISPr-Bandwidth-Max-Up',
    type: 'number',
    operators: [':=', '='],
    example: 20000000,
    description: 'Maximum upload bandwidth',
  },
  {
    attribute: 'WISPr-Bandwidth-Max-Down',
    type: 'number',
    operators: [':=', '='],
    example: 20000000,
    description: 'Maximum download bandwidth',
  },

  // ======================
  // Quota
  // ======================

  {
    attribute: 'Mikrotik-Total-Limit',
    type: 'bytes',
    operators: [':=', '='],
    example: 1073741824,
    description: 'Total traffic limit',
  },
  {
    attribute: 'Mikrotik-Recv-Limit',
    type: 'bytes',
    operators: [':=', '='],
    example: 536870912,
    description: 'Download limit',
  },
  {
    attribute: 'Mikrotik-Xmit-Limit',
    type: 'bytes',
    operators: [':=', '='],
    example: 536870912,
    description: 'Upload limit',
  },
  {
    attribute: 'Mikrotik-Recv-Limit-Gigawords',
    type: 'number',
    operators: [':=', '='],
    example: 1,
    description: 'Download gigawords',
  },
  {
    attribute: 'Mikrotik-Xmit-Limit-Gigawords',
    type: 'number',
    operators: [':=', '='],
    example: 1,
    description: 'Upload gigawords',
  },

  // ======================
  // Addressing
  // ======================

  {
    attribute: 'Framed-IP-Address',
    type: 'ip',
    operators: [':=', '='],
    example: '192.168.88.100',
    description: 'Static IP',
  },
  {
    attribute: 'Framed-IP-Netmask',
    type: 'ip',
    operators: [':=', '='],
    example: '255.255.255.255',
    description: 'Subnet mask',
  },
  {
    attribute: 'Framed-Pool',
    type: 'string',
    operators: [':=', '='],
    example: 'PPPOE_POOL',
    description: 'IP Pool',
  },
  {
    attribute: 'Framed-Route',
    type: 'string',
    operators: [':=', '='],
    example: '0.0.0.0/0 192.168.88.1',
    description: 'Static route',
  },

  // ======================
  // DNS
  // ======================

  {
    attribute: 'MS-Primary-DNS-Server',
    type: 'ip',
    operators: [':=', '='],
    example: '8.8.8.8',
    description: 'Primary DNS',
  },
  {
    attribute: 'MS-Secondary-DNS-Server',
    type: 'ip',
    operators: [':=', '='],
    example: '1.1.1.1',
    description: 'Secondary DNS',
  },

  // ======================
  // MikroTik
  // ======================

  {
    attribute: 'Mikrotik-Address-List',
    type: 'string',
    operators: [':=', '='],
    example: 'Premium',
    description: 'Firewall Address List',
  },
  {
    attribute: 'Mikrotik-Realm',
    type: 'string',
    operators: [':=', '='],
    example: 'ISP',
    description: 'Realm',
  },
  {
    attribute: 'Mikrotik-Mark-Id',
    type: 'string',
    operators: [':=', '='],
    example: 'Premium',
    description: 'Packet Mark',
  },
  {
    attribute: 'Mikrotik-Advertise-URL',
    type: 'string',
    operators: [':=', '='],
    example: 'https://isp.local',
    description: 'Advertisement URL',
  },
  {
    attribute: 'Mikrotik-Advertise-Interval',
    type: 'number',
    operators: [':=', '='],
    example: 60,
    description: 'Advertisement interval',
  },
  {
    attribute: 'Mikrotik-Wireless-Forward',
    type: 'boolean',
    operators: [':=', '='],
    example: true,
    description: 'Wireless Forward',
  },
  {
    attribute: 'Mikrotik-Host-IP',
    type: 'ip',
    operators: [':=', '='],
    example: '192.168.88.1',
    description: 'Host IP',
  },
  {
    attribute: 'Mikrotik-Host-Name',
    type: 'string',
    operators: [':=', '='],
    example: 'mikrotik',
    description: 'Host Name',
  },
  {
    attribute: 'Mikrotik-Group',
    type: 'string',
    operators: [':=', '='],
    example: 'Premium',
    description: 'User Group',
  },

  // ======================
  // VLAN
  // ======================

  {
    attribute: 'Tunnel-Type',
    type: 'string',
    operators: [':=', '='],
    example: 'VLAN',
    description: 'Tunnel Type',
  },
  {
    attribute: 'Tunnel-Medium-Type',
    type: 'string',
    operators: [':=', '='],
    example: 'IEEE-802',
    description: 'Tunnel Medium',
  },
  {
    attribute: 'Tunnel-Private-Group-ID',
    type: 'string',
    operators: [':=', '='],
    example: '100',
    description: 'VLAN ID',
  },

  // ======================
  // PPP
  // ======================

  {
    attribute: 'Framed-MTU',
    type: 'number',
    operators: [':=', '='],
    example: 1492,
    description: 'PPP MTU',
  },
  {
    attribute: 'Framed-Compression',
    type: 'string',
    operators: [':=', '='],
    example: 'Van-Jacobson-TCP-IP',
    description: 'Compression',
  },
  {
    attribute: 'Framed-Routing',
    type: 'string',
    operators: [':=', '='],
    example: 'Broadcast',
    description: 'Routing',
  },

  // ======================
  // Login
  // ======================

  {
    attribute: 'Login-IP-Host',
    type: 'ip',
    operators: [':=', '='],
    example: '192.168.88.1',
    description: 'Login Host',
  },
  {
    attribute: 'Login-Service',
    type: 'string',
    operators: [':=', '='],
    example: 'Telnet',
    description: 'Login Service',
  },
  {
    attribute: 'Login-TCP-Port',
    type: 'number',
    operators: [':=', '='],
    example: 23,
    description: 'TCP Port',
  },
];
export const MikrotikAttributes = [
  {
    attribute: 'Mikrotik-Rate-Limit',
    type: 'string',
    operators: [':=', '='],
    example: '20M/20M',
    description: 'Upload / Download speed limit',
  },
  {
    attribute: 'Mikrotik-Total-Limit',
    type: 'bytes',
    operators: [':=', '='],
    example: 1073741824,
    description: 'Total traffic limit',
  },
  {
    attribute: 'Mikrotik-Recv-Limit',
    type: 'bytes',
    operators: [':=', '='],
    example: 536870912,
    description: 'Download limit',
  },
  {
    attribute: 'Mikrotik-Xmit-Limit',
    type: 'bytes',
    operators: [':=', '='],
    example: 536870912,
    description: 'Upload limit',
  },
  {
    attribute: 'Mikrotik-Recv-Limit-Gigawords',
    type: 'number',
    operators: [':=', '='],
    example: 1,
    description: 'Download limit (Gigawords)',
  },
  {
    attribute: 'Mikrotik-Xmit-Limit-Gigawords',
    type: 'number',
    operators: [':=', '='],
    example: 1,
    description: 'Upload limit (Gigawords)',
  },
  {
    attribute: 'Mikrotik-Address-List',
    type: 'string',
    operators: [':=', '='],
    example: 'Premium',
    description: 'Add user IP to firewall address-list',
  },
  {
    attribute: 'Mikrotik-Mark-Id',
    type: 'string',
    operators: [':=', '='],
    example: 'Premium',
    description: 'Packet mark',
  },
  {
    attribute: 'Mikrotik-Realm',
    type: 'string',
    operators: [':=', '='],
    example: 'ISP',
    description: 'Realm name',
  },
  {
    attribute: 'Mikrotik-Host-IP',
    type: 'ip',
    operators: [':=', '='],
    example: '192.168.88.1',
    description: 'Host IP',
  },
  {
    attribute: 'Mikrotik-Host-Name',
    type: 'string',
    operators: [':=', '='],
    example: 'mikrotik-router',
    description: 'Host name',
  },
  {
    attribute: 'Mikrotik-Group',
    type: 'string',
    operators: [':=', '='],
    example: 'Premium',
    description: 'MikroTik group',
  },
  {
    attribute: 'Mikrotik-Wireless-Forward',
    type: 'boolean',
    operators: [':=', '='],
    example: true,
    description: 'Enable wireless forwarding',
  },
  {
    attribute: 'Mikrotik-Advertise-URL',
    type: 'string',
    operators: [':=', '='],
    example: 'https://isp.example.com',
    description: 'Advertisement URL',
  },
  {
    attribute: 'Mikrotik-Advertise-Interval',
    type: 'number',
    operators: [':=', '='],
    example: 60,
    description: 'Advertisement interval in seconds',
  },
  {
    attribute: 'Mikrotik-Delegated-IPv6-Pool',
    type: 'string',
    operators: [':=', '='],
    example: 'ipv6_pool',
    description: 'Delegated IPv6 Pool',
  },
];
export const Operators = [
  ':=',
  '=',
  '==',
  '+=',
  '!=',
  '>',
  '>=',
  '<',
  '<=',
  '=*',
  '!*',
];
