from django.urls import path
from . import views

urlpatterns = [
    # PDF conversions (from PDF)
    path('pdf-to-word/', views.PDFToWordView.as_view(), name='pdf_to_word'),
    path('pdf-to-excel/', views.PDFToExcelView.as_view(), name='pdf_to_excel'),
    path('pdf-to-image/', views.PDFToImageView.as_view(), name='pdf_to_image'),
    path('pdf-to-ppt/', views.PDFToPPTView.as_view(), name='pdf_to_ppt'),
    path('pdf-to-text/', views.PDFToTextView.as_view(), name='pdf_to_text'),
    path('pdf-to-html/', views.PDFToHTMLView.as_view(), name='pdf_to_html'),
    path('pdf-to-csv/', views.PDFToCSVView.as_view(), name='pdf_to_csv'),

    # To PDF conversions
    path('word-to-pdf/', views.WordToPDFView.as_view(), name='word_to_pdf'),
    path('excel-to-pdf/', views.ExcelToPDFView.as_view(), name='excel_to_pdf'),
    path('image-to-pdf/', views.ImageToPDFView.as_view(), name='image_to_pdf'),
    path('ppt-to-pdf/', views.PPTToPDFView.as_view(), name='ppt_to_pdf'),
    path('html-to-pdf/', views.HTMLToPDFView.as_view(), name='html_to_pdf'),
    path('text-to-pdf/', views.TextToPDFView.as_view(), name='text_to_pdf'),
    path('csv-to-pdf/', views.CSVToPDFView.as_view(), name='csv_to_pdf'),

    # Word conversions
    path('word-to-image/', views.WordToImageView.as_view(), name='word_to_image'),
    path('word-to-html/', views.WordToHTMLView.as_view(), name='word_to_html'),
    path('word-to-text/', views.WordToTextView.as_view(), name='word_to_text'),

    # Image conversions
    path('image-convert/', views.ImageFormatConvertView.as_view(), name='image_convert'),
    path('image-compress/', views.ImageCompressView.as_view(), name='image_compress'),

    # OCR
    path('ocr/', views.OCRView.as_view(), name='ocr'),
]
