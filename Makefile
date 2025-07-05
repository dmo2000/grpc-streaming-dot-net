deps:
	cd frontend && npm install
	cd backend && dotnet restore

run-backend:
	cd backend && dotnet run
run-frontend:
	cd frontend && npm run dev