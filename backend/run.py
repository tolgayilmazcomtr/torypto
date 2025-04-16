#!/usr/bin/env python3
"""
Torypto API uygulamasını çalıştırmak için ana script.
Bu script, mevcut venv içindeki python interpreter'ı kullanarak uvicorn'u çalıştırır.
"""
import os
import sys
import subprocess

if __name__ == "__main__":
    # Mevcut dizin
    current_dir = os.path.abspath(os.path.dirname(__file__))
    print(f"Çalışma dizini: {current_dir}")
    
    # API çalışırken kullanılacak port
    PORT = int(os.getenv("PORT", 8000))
    
    # backend root dizinini proje kökünün üzerine ekle
    project_root = os.path.abspath(os.path.join(current_dir, ".."))
    sys.path.insert(0, project_root)
    sys.path.insert(0, current_dir)
    
    print("Modül yolları:")
    print(f"Python path: {sys.path}")
    
    try:
        # Modülleri direkt app/ klasöründen import etmeyi dene
        run_module = "app.main:app"
        print(f"{run_module} modülünü deniyorum...")
        
        # Doğrudan uvicorn modülünü çalıştır
        from uvicorn import run
        print("Uvicorn modülü başarıyla import edildi")
        
        # API'yi geliştirme modunda çalıştır
        print(f"API http://localhost:{PORT} adresinde başlatılıyor...")
        run(
            run_module, 
            host="0.0.0.0", 
            port=PORT, 
            reload=True,
            log_level="info"
        )
    except ImportError as e:
        print(f"ImportError: {e}")
        print("Alternatif modülü deniyorum...")
        
        try:
            # İç içe import işlemini düzelt, app dizinindeki main.py'yi direkt çalıştır
            os.chdir(os.path.join(current_dir, "app"))
            print(f"Dizin değiştirildi: {os.getcwd()}")
            
            # Python yolunu güncelle
            sys.path.insert(0, os.getcwd())
            print(f"Güncellenmiş Python path: {sys.path}")
            
            run_module = "main:app"
            print(f"{run_module} modülünü deniyorum...")
            
            from uvicorn import run
            run(
                run_module, 
                host="0.0.0.0", 
                port=PORT, 
                reload=True,
                log_level="info"
            )
        except Exception as e2:
            print(f"İkinci deneme de başarısız: {str(e2)}")
            sys.exit(1)
            
    except Exception as e:
        print(f"Hata: {str(e)}")
        sys.exit(1) 