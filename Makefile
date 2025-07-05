install-deps:
	cd frontend && npm install
	cd backend && dotnet restore
	npm config set @buf:registry https://buf.build/gen/npm/v1/

generate-protos:
	cd frontend && npm run generate

setup: install-deps generate-protos

run-backend:
	cd backend && dotnet run
run-frontend:
	cd frontend && npm run dev