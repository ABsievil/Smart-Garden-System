FROM openjdk:21-jdk

WORKDIR /app

COPY target/smart-garden-system.jar smart-garden-system.jar

ENTRYPOINT ["java", "-jar", "smart-garden-system.jar"]