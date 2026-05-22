# ─────────────────────────────────────────────
#  Noteverse — Dockerfile
#  Serves the static site via nginx:alpine
#  Image size: ~25 MB
# ─────────────────────────────────────────────

# Use the official lightweight nginx image
FROM nginx:alpine

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy all static site files into nginx's web root
COPY index.html        /usr/share/nginx/html/
COPY css/              /usr/share/nginx/html/css/
COPY js/               /usr/share/nginx/html/js/
COPY assets/           /usr/share/nginx/html/assets/
COPY robots.txt        /usr/share/nginx/html/
COPY staticwebapp.config.json /usr/share/nginx/html/

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# nginx runs in foreground by default — no extra CMD needed
