from setuptools import setup, find_packages

setup(
    name="torypto",
    version="0.1.0",
    description="Torypto kripto para analiz platformu",
    author="Tolga Yılmaz",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=[
        "fastapi>=0.100.0",
        "uvicorn>=0.22.0",
        "sqlalchemy>=2.0.0",
        "pydantic>=2.0.0",
        "python-dotenv>=1.0.0",
        "psycopg2-binary>=2.9.0",
        "python-jose>=3.3.0",
        "passlib>=1.7.4",
        "bcrypt>=4.0.0",
        "aiohttp>=3.8.0",
        "requests>=2.25.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "black>=23.0.0",
            "isort>=5.0.0",
            "mypy>=1.0.0",
        ],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
) 