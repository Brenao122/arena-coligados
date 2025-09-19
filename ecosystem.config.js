module.exports = {
  apps: [{
    name: 'arena-coligados',
    script: 'npm',
    args: 'start',
    cwd: '/srv/arena-coligados',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_SITE_URL: 'https://srv998805.hstgr.cloud'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_SITE_URL: 'https://srv998805.hstgr.cloud'
    },
    error_file: '/var/log/arena/error.log',
    out_file: '/var/log/arena/out.log',
    log_file: '/var/log/arena/combined.log',
    time: true
  }]
};
