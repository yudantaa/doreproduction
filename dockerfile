# Use official PHP image with needed extensions
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    libpq-dev libjpeg-dev libfreetype6-dev npm gnupg

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install Node and PNPM
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm

# Copy project files
COPY . .

# Install backend & frontend deps
RUN composer install --no-dev --optimize-autoloader
RUN pnpm install
RUN pnpm run build

# Laravel config
RUN php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear && \
    php artisan migrate --force || true

# Expose port and start Laravel
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
