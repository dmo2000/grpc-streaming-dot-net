install-deps:
	cd frontend && npm install
	cd backend && dotnet restore
	npm config set @buf:registry https://buf.build/gen/npm/v1/

buf-protos:
	cd frontend && npm run buf

setup: install-deps buf-protos

run-backend:
	cd backend && dotnet run
run-frontend:
	cd frontend && npm run dev