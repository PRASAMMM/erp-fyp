# ── Stage 1: Build ───────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Cache dependencies first (only re-downloads when pom.xml changes)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Run ─────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy built jar from stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose port (Railway reads PORT env var automatically)
EXPOSE 8080

# Run with Railway's PORT env variable support
ENTRYPOINT ["java", \
  "-Dserver.port=${PORT:=8080}", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
