# ToDoAspCore - ASP.NET Core 3.1 Server

Sample todo-api

## Run

Linux/OS X:

```
sh build.sh
```

Windows:

```
build.bat
```
## Run in Docker

```
cd src/ToDoAspCore
docker build -t todoaspcore .
docker run -p 5000:8080 todoaspcore
```
