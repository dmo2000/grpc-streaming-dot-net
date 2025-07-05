install-deps:
	cd frontend && npm install
	cd backend && dotnet restore
	npm config set @buf:registry https://buf.build/gen/npm/v1/

generate-js-protos:
	cd frontend && npx buf generate buf.build/connectrpc/eliza

setup: install-deps generate-js-protos

run-backend:
	cd backend && dotnet run
run-frontend:
	cd frontend && npm run dev