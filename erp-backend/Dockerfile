FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
CMD ["sh", "-c", "java -Djava.security.egd=file:/dev/./urandom -Dserver.port=$PORT -Dserver.address=0.0.0.0 -jar app.jar"]
