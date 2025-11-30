FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# Copy everything
COPY . .

# Give execute permission to mvnw
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# ---- Runtime image ----
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
