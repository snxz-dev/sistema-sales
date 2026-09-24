const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, Table, TableRow, TableCell, BorderStyle, WidthType, PageBreak, SimpleField } = require("docx");

const mmToTwip = (mm) => mm * 56.6929133858;

const pt = (size) => size * 2;

function createDoc() {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        size: pt(12),
                        font: "Times New Roman",
                    },
                    paragraph: {
                        spacing: {
                            line: 480, // double spacing
                        },
                    },
                },
                heading1: {
                    run: {
                        size: pt(12),
                        bold: true,
                        font: "Times New Roman",
                    },
                    paragraph: {
                        spacing: { line: 480 },
                        alignment: AlignmentType.CENTER
                    }
                },
                heading2: {
                    run: {
                        size: pt(12),
                        bold: true,
                        font: "Times New Roman",
                    },
                    paragraph: {
                        spacing: { line: 480 },
                        alignment: AlignmentType.LEFT
                    }
                },
                heading3: {
                    run: {
                        size: pt(12),
                        bold: true,
                        italics: true,
                        font: "Times New Roman",
                    },
                    paragraph: {
                        spacing: { line: 480 },
                        alignment: AlignmentType.LEFT
                    }
                }
            }
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: mmToTwip(25.4),
                            bottom: mmToTwip(25.4),
                            right: mmToTwip(25.4),
                            left: mmToTwip(25.4),
                        },
                        pageNumbers: {
                            start: 1,
                            formatType: "decimal",
                        },
                    },
                },
                children: buildContent()
            }
        ]
    });

    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("Documentacion_Final_SISTEMASALES.docx", buffer);
        console.log("DOCX Generado Correctamente.");
    });
}

function P(text, indent = true, bold = false) {
    return new Paragraph({
        children: [new TextRun({ text, bold })],
        indent: indent ? { firstLine: mmToTwip(12.7) } : undefined,
    });
}

function P_center(text, bold=false) {
    return new Paragraph({
        children: [new TextRun({ text, bold })],
        alignment: AlignmentType.CENTER,
    });
}

function Img(path, caption) {
    if(!fs.existsSync(path)) {
        return [new Paragraph({ text: `[Imagen no encontrada: ${path}]` })];
    }
    return [
        new Paragraph({
            children: [
                new ImageRun({
                    data: fs.readFileSync(path),
                    transformation: { width: 600, height: 350 }, // aprox
                }),
            ],
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            children: [new TextRun({ text: caption, italics: true })],
            alignment: AlignmentType.CENTER,
        })
    ];
}

function createTable(headers, rowsData) {
    const tableRows = [];
    tableRows.push(
        new TableRow({
            children: headers.map(h => new TableCell({ children: [new Paragraph({text: h, bold:true})], width: {size: 100/headers.length, type: WidthType.PERCENTAGE} })),
        })
    );
    for(let row of rowsData) {
        tableRows.push(
            new TableRow({
                children: row.map(cell => new TableCell({ children: [new Paragraph(cell)], width: {size: 100/row.length, type: WidthType.PERCENTAGE} })),
            })
        );
    }
    return new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
    });
}

function buildContent() {
    let children = [];

    // PORTADA
    children.push(P("", false));
    children.push(P("", false));
    children.push(P("", false));
    children.push(P("", false));
    children.push(P_center("Instituto Superior Universitario Japón"));
    children.push(P_center("Carrera: Tecnología Superior en Desarrollo de Software"));
    children.push(P("", false));
    children.push(P_center("Título: Desarrollo de un Sistema de Información para la Gestión Integral de Ventas, Facturación, Inventarios y Procesos de Abastecimiento en la Empresa SISTEMA_SALES S.A.", true));
    children.push(P("", false));
    children.push(P_center("Autor: Stalyn Mateo Sánchez Cevallos"));
    children.push(P_center("Tutor/docente: Luis Calo"));
    children.push(P_center("Año: 2026"));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // ÍNDICE (Placeholder text as docx doesn't fully support automatic native TOC easily without complex xml, but we add a placeholder)
    children.push(new Paragraph({ text: "Índice General", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({
        children: [new SimpleField('TOC \\o "1-3" \\h \\z \\u')]
    }));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    children.push(new Paragraph({ text: "Índice de Tablas", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({
        children: [new SimpleField('TOC \\h \\z \\c "Tabla"')]
    }));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    children.push(new Paragraph({ text: "Índice de Figuras", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({
        children: [new SimpleField('TOC \\h \\z \\c "Figura"')]
    }));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // 1. INTRO
    children.push(new Paragraph({ text: "1. Introducción", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: "Contextualización de SISTEMA_SALES S.A.", heading: HeadingLevel.HEADING_2 }));
    children.push(P("SISTEMA_SALES S.A. es una organización del sector comercial orientada a la venta de productos al por mayor y menor. Para responder al incremento en la demanda, la empresa identificó la necesidad de gestionar de manera eficiente la información operativa que se genera a partir de sus transacciones diarias de ventas, compras y control de existencias."));
    
    children.push(new Paragraph({ text: "Situación problemática", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Según el caso de estudio oficial, SISTEMA_SALES S.A. experimenta dificultades significativas en el control y la gestión de la información relacionada con sus procesos de ventas y abastecimiento. El incremento constante en la demanda de sus productos ha evidenciado estas deficiencias."));
    
    children.push(new Paragraph({ text: "Propósito del proyecto", heading: HeadingLevel.HEADING_2 }));
    children.push(P("El propósito del proyecto es desarrollar un sistema de información de escritorio que contribuya a centralizar el registro de operaciones comerciales, favoreciendo la consistencia de los datos y permitiendo mejorar la trazabilidad de las facturas y órdenes de compra."));
    
    children.push(new Paragraph({ text: "Descripción resumida de la solución desarrollada", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Se construyó una aplicación de escritorio multiplataforma estructurada bajo un modelo híbrido. La solución desarrollada emplea React y TypeScript para la interfaz gráfica, integrados mediante Electron con un entorno de ejecución Node.js y un motor de base de datos SQLite embebido, con el fin de proporcionar módulos dedicados para entidades, facturación, inventario y abastecimiento."));

    // 2. PLANTEAMIENTO
    children.push(new Paragraph({ text: "2. Planteamiento del problema", heading: HeadingLevel.HEADING_1 }));
    children.push(P("Las dificultades planteadas en el caso oficial de SISTEMA_SALES S.A. derivan de los retos logísticos propios de la comercialización a gran escala."));
    children.push(new Paragraph({ text: "Causas", heading: HeadingLevel.HEADING_2 }));
    children.push(P("La causa principal expuesta en la documentación base es la falta de un sistema centralizado y automatizado dedicado al registro de las operaciones comerciales de la empresa."));
    children.push(new Paragraph({ text: "Efectos", heading: HeadingLevel.HEADING_2 }));
    children.push(P("La ausencia de esta centralización produce inconsistencia en los datos y dificultad para asegurar la trazabilidad de las operaciones. En consecuencia, se genera desorganización en la información referencial de clientes, proveedores y vendedores, lo cual dificulta controlar adecuadamente el stock actual y el stock mínimo de los productos. A nivel directivo, estos factores limitan la capacidad de tomar decisiones estratégicas fundamentadas en reportes confiables."));

    // 3. JUSTIFICACION
    children.push(new Paragraph({ text: "3. Justificación", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: "Justificación técnica", heading: HeadingLevel.HEADING_2 }));
    children.push(P("La integración de tecnologías web modernas dentro de un contenedor nativo permite organizar el proyecto de manera modular. La capa de presentación se confía a React (Meta Platforms, Inc., 2025), mientras que el almacenamiento de datos locales se delega a SQLite (Hipp, 2024). Esta decisión arquitectónica mitiga la dependencia de infraestructuras externas complejas, facilitando que el sistema sea instalado y ejecutado de manera independiente en los equipos del departamento comercial."));
    children.push(new Paragraph({ text: "Justificación operativa", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Operativamente, la centralización de los procesos mediante la aplicación desarrollada favorece el flujo de la información. Al relacionar lógicamente a los productos con los documentos de adquisición y venta, la empresa reduce el riesgo de discrepancias entre las existencias registradas y el registro comercial histórico de proveedores y vendedores."));
    children.push(new Paragraph({ text: "Beneficios esperados", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Como resultados proyectados, se espera que el sistema implementado permita registrar eficientemente las facturas de venta, contribuya a mantener el inventario sincronizado de forma automática (actualizando el stock durante compras y ventas) y mejore significativamente el rastreo de los documentos origen hacia sus entidades involucradas."));

    // 4. OBJETIVOS
    children.push(new Paragraph({ text: "4. Objetivos", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: "Objetivo general", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Desarrollar un Sistema de Información para la Gestión Integral de Ventas, Facturación, Inventarios y Procesos de Abastecimiento en la Empresa SISTEMA_SALES S.A."));
    children.push(new Paragraph({ text: "Objetivos específicos", heading: HeadingLevel.HEADING_2 }));
    children.push(P("1. Diseñar un modelo de base de datos relacional para la gestión estructurada de entidades, productos, facturas y abastecimiento.", false));
    children.push(P("2. Construir una interfaz de usuario fluida utilizando componentes modulares en React.", false));
    children.push(P("3. Implementar la lógica transaccional y el control de inventario en el backend con Node.js y SQLite, orientados a actualizar el stock en tiempo real durante compras y ventas.", false));
    children.push(P("4. Desarrollar módulos para la generación de reportes que consoliden la información operativa.", false));

    // 5. ALCANCE
    children.push(new Paragraph({ text: "5. Alcance y limitaciones", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: "Qué comprende el sistema", heading: HeadingLevel.HEADING_2 }));
    children.push(P("El proyecto abarca el desarrollo de una Aplicación de Escritorio bajo el stack tecnológico de React, TypeScript, Electron y SQLite. Incluye los módulos funcionales para gestionar las transacciones de facturación y abastecimiento, así como el mantenimiento (CRUD) de Distritos, Proveedores, Clientes, Vendedores y Productos."));
    children.push(new Paragraph({ text: "Qué módulos fueron desarrollados (Implementación real)", heading: HeadingLevel.HEADING_2 }));
    children.push(P("De acuerdo a las Fases aprobadas, se construyeron los siguientes módulos:"));
    children.push(P("• Dashboard: Panel principal de la aplicación.", false));
    children.push(P("• Facturación: Módulo para emitir facturas con cálculo de IVA y vinculación de cliente y vendedor.", false));
    children.push(P("• Inventario: Módulo para la visualización del catálogo de productos y estados de stock.", false));
    children.push(P("• Abastecimiento: Módulo para la creación de órdenes de compra hacia proveedores.", false));
    children.push(P("• Entidades: Módulo destinado al registro unificado de Clientes, Proveedores, Vendedores y Distritos.", false));
    children.push(P("• Reportes: Módulo inicial destinado a agrupar información general de las ventas e inventario.", false));
    children.push(new Paragraph({ text: "Qué funcionalidades quedan como posibles mejoras futuras", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Las siguientes características no forman parte de esta versión y quedan perfiladas como mejoras para futuras etapas de desarrollo:"));
    children.push(P("• Desarrollo de visualizaciones estadísticas dinámicas y exportación avanzada en el módulo de Reportes.", false));
    children.push(P("• Módulos adicionales de contabilidad general (Libro Diario, nómina de sueldos de vendedores).", false));
    children.push(P("• Mecanismos en segundo plano para respaldos automáticos programados de la base de datos hacia servidores externos.", false));

    // 6. FACTIBILIDAD
    children.push(new Paragraph({ text: "6. Estudio de factibilidad", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: "Factibilidad técnica", heading: HeadingLevel.HEADING_2 }));
    children.push(P("La elección de React, TypeScript, Electron, Node.js y SQLite se fundamenta en su alta adopción y capacidad para proporcionar un rendimiento adecuado para un entorno de escritorio."));
    children.push(new Paragraph({ text: "Factibilidad económica", heading: HeadingLevel.HEADING_2 }));
    children.push(P("La utilización de lenguajes de programación y motores de bases de datos de código abierto reduce los costos asociados a licencias comerciales. El costo principal del proyecto reside de manera exclusiva en las horas de desarrollo e ingeniería."));
    children.push(new Paragraph({ text: "Factibilidad operativa", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Al introducir un sistema centralizado, la dinámica de trabajo del personal experimentará modificaciones constructivas. Se requerirá diseñar y ejecutar un plan de capacitación inicial para asegurar la adopción adecuada del nuevo sistema por parte de los operadores de la empresa."));

    // 7. REQUERIMIENTOS
    children.push(new Paragraph({ text: "7. Requerimientos del sistema", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: "Requerimientos funcionales", heading: HeadingLevel.HEADING_2 }));
    children.push(P("• RF-01 Gestión de Distritos: Permitir registrar, consultar y editar distritos.", false));
    children.push(P("• RF-02 Gestión de Entidades: Permitir registrar Clientes, Proveedores y Vendedores, incluyendo sus atributos obligatorios.", false));
    children.push(P("• RF-03 Gestión de Inventario: Mantener el catálogo de Productos, almacenando el stock actual, stock mínimo, precio y marca.", false));
    children.push(P("• RF-04 Facturación (Ventas): Generar facturas calculando el IVA, vinculando a los responsables y detallando los productos.", false));
    children.push(P("• RF-05 Abastecimiento: Generar órdenes de compra a proveedores especificando el detalle de productos.", false));
    children.push(P("• RF-06 Reportes: Consolidar información clave de ventas, inventario y abastecimiento.", false));
    
    children.push(new Paragraph({ text: "Requerimientos no funcionales", heading: HeadingLevel.HEADING_2 }));
    children.push(P("• Arquitectura de aplicación de escritorio multiplataforma (Electron).", false));
    children.push(P("• Interfaz de usuario intuitiva y de rápida navegación.", false));
    children.push(P("• Rendimiento adecuado para resolver operaciones de lectura/escritura en la base de datos local eficientemente.", false));
    children.push(P("• Seguridad en la arquitectura de archivos para reducir el riesgo de manipulación no autorizada.", false));
    children.push(P("• Mantenibilidad del código favorecida por el tipado estricto.", false));

    children.push(new Paragraph({ text: "Reglas de negocio", heading: HeadingLevel.HEADING_2 }));
    children.push(P("• RN-01 Actualización Automática de Stock: El sistema actualizará el stock actual del inventario, restando la cantidad al registrarse una factura de venta, y sumando la cantidad cuando se concrete la recepción de un abastecimiento.", false));
    
    children.push(new Paragraph({ text: "Trazabilidad entre requerimientos y módulos implementados", heading: HeadingLevel.HEADING_2 }));
    children.push(createTable(["Requerimiento Funcional", "Módulo Desarrollado en la Interfaz"], [
        ["RF-01, RF-02 (Personas/Zonas)", "Módulo de Entidades (Clientes, Proveedores, Vendedores, Distritos)"],
        ["RF-03 (Catálogo)", "Módulo de Inventario"],
        ["RF-04 (Ventas)", "Módulo de Facturación"],
        ["RF-05 (Compras)", "Módulo de Abastecimiento"],
        ["RF-06 (Análisis)", "Módulo de Reportes"]
    ]));
    children.push(P_center("Tabla 3. Trazabilidad de Requerimientos vs Módulos Implementados", true));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // 8. METODOLOGIA
    children.push(new Paragraph({ text: "8. Metodología de desarrollo", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: "Explicación de Scrum y Marco Organizativo", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Scrum es un marco de trabajo ágil que fomenta la colaboración iterativa y el desarrollo incremental. Se divide en ciclos de trabajo cortos (Schwaber & Sutherland, 2020), lo que permite entregas continuas de valor y capacidad de adaptación. Se seleccionó Scrum porque permite adaptar las decisiones técnicas conforme el proyecto avanza, favoreciendo la revisión del diseño de la base de datos y su integración con los prototipos de interfaz sin la rigidez de un modelo en cascada."));
    children.push(new Paragraph({ text: "Aplicación planificada en SISTEMA_SALES S.A.", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Los requerimientos del caso oficial fueron utilizados como fuente directa para construir el Product Backlog. Scrum se utilizó como marco organizativo adaptado al proyecto académico individual. El proyecto se documentó mediante 6 Fases aprobadas, que representan etapas iterativas lógicas (Diseño, Interfaz, Backend, Integración), permitiendo el control de avance sin requerir la ejecución de eventos grupales formales debido a la naturaleza individual de la implementación técnica."));

    // 9. UML
    children.push(new Paragraph({ text: "9. Análisis y diseño UML", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: "Diagrama de Casos de Uso", heading: HeadingLevel.HEADING_2 }));
    children.push(P("El diagrama identifica los actores principales interactuando con el sistema: el Vendedor (enfocado en facturación y clientes), el Administrador (con acceso a catálogos, vendedores y reportes) y el Jefe de Compras (encargado de proveedores y órdenes)."));
    children.push(...Img("fig1.png", "Figura 1. Diagrama de Casos de Uso"));

    children.push(new Paragraph({ text: "Diagrama de Clases", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Este modelo estructural muestra las entidades principales descritas en el caso de la empresa, especificando sus atributos y los métodos teóricos de instanciación."));
    children.push(...Img("fig2.png", "Figura 2. Diagrama de Clases"));

    // 10. MER
    children.push(new Paragraph({ text: "10. Diseño de base de datos", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: "Modelo Entidad-Relación (MER)", heading: HeadingLevel.HEADING_2 }));
    children.push(P("El diseño físico de la base de datos se estructuró contemplando 10 entidades. Se define una entidad geográfica DISTRITO de la cual dependen las entidades CLIENTE, PROVEEDOR y VENDEDOR. La entidad PRODUCTO permite articular las transacciones de FACTURA y ORDEN_COMPRA. La entidad ABASTECIMIENTO se diseña como una tabla asociativa explícita que almacena la relación entre PROVEEDOR y PRODUCTO, con el atributo de precio acordado o vigente de la relación proveedor-producto."));
    children.push(...Img("fig3.png", "Figura 3. Modelo Entidad-Relación"));

    // 11. DICCIONARIO
    children.push(new Paragraph({ text: "11. Diccionario de datos", heading: HeadingLevel.HEADING_1 }));
    children.push(P("Nota Técnica: Los tipos de datos descritos a continuación (VARCHAR, DATE, BOOLEAN) corresponden al modelo lógico diseñado. Sin embargo, a nivel de implementación, SQLite trabaja físicamente mediante afinidades de tipo como TEXT, INTEGER y REAL.", false));

    children.push(createTable(["Tabla", "Campo", "Tipo", "Llave", "Descripción"], [
        ["DISTRITO", "id_distrito", "VARCHAR", "PK", "ID distrito."],
        ["DISTRITO", "descripcion", "VARCHAR", "", "Nombre distrito."],
        ["CLIENTE", "ruc", "VARCHAR", "PK", "RUC."],
        ["CLIENTE", "razon_social", "VARCHAR", "", "Nombre empresa."],
        ["CLIENTE", "id_distrito", "VARCHAR", "FK", "Ref. DISTRITO."],
        ["PROVEEDOR", "id_proveedor", "VARCHAR", "PK", "RUC proveedor."],
        ["PROVEEDOR", "razon_social", "VARCHAR", "", "Nombre proveedor."],
        ["PROVEEDOR", "id_distrito", "VARCHAR", "FK", "Ref. DISTRITO."],
        ["VENDEDOR", "id_vendedor", "VARCHAR", "PK", "ID empleado."],
        ["VENDEDOR", "nombres", "VARCHAR", "", "Nombre."],
        ["VENDEDOR", "id_distrito", "VARCHAR", "FK", "Ref. DISTRITO."]
    ]));
    children.push(P_center("Tabla 1. Diccionario de Datos - Entidades Geográficas y Personales", true));

    children.push(P("", false));

    children.push(createTable(["Tabla", "Campo", "Tipo", "Llave", "Descripción"], [
        ["PRODUCTO", "codigo_producto", "VARCHAR", "PK", "SKU."],
        ["PRODUCTO", "descripcion", "VARCHAR", "", "Detalle."],
        ["PRODUCTO", "stock_actual", "INTEGER", "", "Cantidad actual."],
        ["ABASTECIMIENTO", "id_proveedor", "VARCHAR", "PK,FK", "Ref. PROVEEDOR."],
        ["ABASTECIMIENTO", "codigo_producto", "VARCHAR", "PK,FK", "Ref. PRODUCTO."],
        ["ABASTECIMIENTO", "precio", "REAL", "", "Precio vigente."],
        ["FACTURA", "numero_factura", "VARCHAR", "PK", "Secuencial."],
        ["FACTURA", "ruc_cliente", "VARCHAR", "FK", "Ref. CLIENTE."],
        ["FACTURA", "id_vendedor", "VARCHAR", "FK", "Ref. VENDEDOR."],
        ["DETALLE_FACTURA", "id_detalle", "INTEGER", "PK", "ID único."],
        ["DETALLE_FACTURA", "numero_factura", "VARCHAR", "FK", "Ref. FACTURA."],
        ["DETALLE_FACTURA", "codigo_producto", "VARCHAR", "FK", "Ref. PRODUCTO."],
        ["DETALLE_FACTURA", "cantidad", "INTEGER", "", "Unidades."],
        ["ORDEN_COMPRA", "numero_orden", "VARCHAR", "PK", "Secuencial."],
        ["ORDEN_COMPRA", "id_proveedor", "VARCHAR", "FK", "Ref. PROVEEDOR."],
        ["DETALLE_ORDEN", "id_detalle_orden", "INTEGER", "PK", "ID único."],
        ["DETALLE_ORDEN", "numero_orden", "VARCHAR", "FK", "Ref. ORDEN_COMPRA."],
        ["DETALLE_ORDEN", "codigo_producto", "VARCHAR", "FK", "Ref. PRODUCTO."]
    ]));
    children.push(P_center("Tabla 2. Diccionario de Datos - Entidades de Productos y Comercialización", true));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // 12. ARQ
    children.push(new Paragraph({ text: "12. Arquitectura y diseño técnico", heading: HeadingLevel.HEADING_1 }));
    children.push(P("El proyecto fue diseñado aplicando una arquitectura orientada a separar la interfaz gráfica del procesamiento local de la base de datos. El flujo estructural de las operaciones sigue el patrón:"));
    children.push(P_center("React → IPC → Controller → Service → Repository → SQLite"));
    children.push(...Img("fig4.png", "Figura 4. Diagrama de Arquitectura Híbrida del Sistema"));

    // 13. PARADIGMAS
    children.push(new Paragraph({ text: "13. Paradigmas de programación", heading: HeadingLevel.HEADING_1 }));
    children.push(P("En la construcción de la aplicación se conjugaron dos enfoques principales de desarrollo de software: Programación Orientada a Objetos (POO) en la capa de Backend para agrupar repositorios y servicios, y Programación Funcional/Declarativa en React para la interfaz de usuario."));

    // 14. TECH
    children.push(new Paragraph({ text: "14. Tecnologías utilizadas", heading: HeadingLevel.HEADING_1 }));
    children.push(P("• React: Utilizada por su capacidad de construir componentes reutilizables.", false));
    children.push(P("• TypeScript: Provee tipos estáticos para establecer interfaces estrictas (Microsoft Corporation, 2024).", false));
    children.push(P("• Vite: Herramienta de compilación para entornos frontend (Vitejs, 2024).", false));
    children.push(P("• Electron: Framework que embebe Chromium y Node.js.", false));
    children.push(P("• SQLite: Motor de base de datos relacional de archivo único.", false));
    children.push(P("• better-sqlite3: Librería puente de Node.js de ejecución síncrona.", false));

    // 15. SEGURIDAD
    children.push(new Paragraph({ text: "15. Seguridad", heading: HeadingLevel.HEADING_1 }));
    children.push(P("La seguridad lógica y prevención de vulnerabilidades desde la aplicación hacia la base de datos local emplea los siguientes mecanismos:"));
    children.push(P("• Aislamiento en Electron: La configuración con `nodeIntegration: false` y `contextIsolation: true` restringe al frontend de invocar módulos nativos.", false));
    children.push(P("• ContextBridge y Preload: La comunicación web/nativo se realiza consistentemente mediante `preload.ts` a través del `contextBridge`, limitando las funciones expuestas vía IPC.", false));
    children.push(P("• Mecanismos de Base de Datos: La aplicación utiliza consultas parametrizadas, lo que mitiga el riesgo de inyección SQL, y habilita `PRAGMA foreign_keys = ON` para salvaguardar la integridad referencial.", false));
    children.push(P("Nota: Estas decisiones contribuyen a incrementar la robustez de la aplicación, pero no la vuelven completamente invulnerable frente a accesos físicos directos al archivo de base de datos.", false));

    // 16. UI
    children.push(new Paragraph({ text: "16. Diseño de interfaz", heading: HeadingLevel.HEADING_1 }));
    children.push(P("El diseño visual se estructuró a través de un panel lateral fijo para navegación. El Módulo de Entidades agrupa Clientes, Proveedores, Distritos y Vendedores."));
    children.push(...Img("assets/dashboard.png", "Figura 5. Módulo Dashboard"));
    children.push(...Img("assets/facturacion.png", "Figura 6. Módulo Facturación"));
    children.push(...Img("assets/inventario.png", "Figura 7. Módulo de Inventario"));
    children.push(...Img("assets/abastecimiento.png", "Figura 8. Módulo de Abastecimiento"));
    children.push(...Img("assets/entidades.png", "Figura 9. Módulo de Entidades"));
    children.push(...Img("assets/reportes.png", "Figura 10. Módulo de Reportes"));

    // 17. IMPLEMENTACION
    children.push(new Paragraph({ text: "17. Implementación", heading: HeadingLevel.HEADING_1 }));
    children.push(P("La implementación separa la estructura del frontend y el backend nativo. En el backend, el archivo `preload.ts` actúa como intermediario IPC. La ruta de almacenamiento de SQLite utiliza `app.getPath('userData')`, localizando el archivo en un directorio escribible destinado a los datos de la aplicación, eludiendo problemas de permisos restrictivos del sistema."));

    // 18. TRANSACCIONES
    children.push(new Paragraph({ text: "18. Transacciones y control de inventario", heading: HeadingLevel.HEADING_1 }));
    children.push(P("Para emitir una factura, la aplicación recupera el stock disponible, agrupa la inserción de cabecera y detalles en un bloque BEGIN y COMMIT, y si existe insuficiencia, ejecuta ROLLBACK. Esto evita cambios parciales dentro de la transacción."));
    children.push(P("En el Abastecimiento, se genera una Orden de Compra (estado: Pendiente). Posteriormente, al registrar la recepción de los productos en el almacén, el estado avanza a Recibida y en ese momento se dispara el incremento sistemático sobre el stock actual."));

    // 19. PRUEBAS
    children.push(new Paragraph({ text: "19. Plan de pruebas y validación", heading: HeadingLevel.HEADING_1 }));
    children.push(P("Nota: Estas pruebas constituyen el plan de calidad propuesto para validar la operatividad del sistema en etapas productivas.", false));
    children.push(createTable(["Tipo de Prueba", "Descripción", "Estado"], [
        ["Persistencia al Reinicio", "Evaluar que, tras ejecutar app.quit() y reabrir, los datos permanezcan íntegros.", "Pendiente de ejecución"],
        ["Validación de Rollback", "Evaluar que un fallo forzado evite guardar datos parciales de una factura.", "Pendiente de ejecución"],
        ["Integridad Referencial", "Insertar ID inexistente observando rechazo por Foreign Key.", "Pendiente de ejecución"],
        ["Creación de Entidades", "Flujos de ingreso manual de Clientes y Vendedores.", "Prueba recomendada"],
        ["Venta sin Stock", "Intentar emitir factura excediendo el stock_actual.", "Pendiente de ejecución"]
    ]));
    children.push(P_center("Tabla 4. Matriz de Plan de Pruebas", true));

    // INDICADORES
    children.push(new Paragraph({ text: "Indicadores y Resultados Esperados", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Para evaluar la viabilidad y éxito futuro de la aplicación en el entorno productivo de la empresa, se ha propuesto el siguiente esquema de indicadores de rendimiento:"));
    children.push(createTable(["Nombre", "Propósito", "Método de medición", "Fuente", "Estado actual"], [
        ["Eficiencia de Venta", "Medir agilidad en facturación.", "Promedio de tiempo (en seg.) por transacción.", "Registros del sistema (timestamps).", "Pendiente de medición"],
        ["Control de Stock", "Verificar sincronización física/digital.", "Porcentaje de discrepancia entre sistema y conteo.", "Auditoría mensual comparativa.", "Pendiente de medición"],
        ["Trazabilidad Documental", "Medir rastreabilidad de facturas/compras.", "Porcentaje de documentos vinculados a un responsable.", "Consultas SQL sobre llaves foráneas.", "Pendiente de medición"]
    ]));
    children.push(P_center("Tabla 5. Esquema de Indicadores Propuestos", true));

    // 20. RESULTADOS
    children.push(new Paragraph({ text: "20. Resultados", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: "Resultados de implementación", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Se logró codificar un Sistema de Información híbrido utilizando tecnologías modernas, demostrando estructuralmente la articulación entre un frontend en React, el puente IPC de Electron y una base de datos relacional (10 tablas) en SQLite para la gestión unificada de ventas y compras."));
    children.push(new Paragraph({ text: "Resultados de validación", heading: HeadingLevel.HEADING_2 }));
    children.push(P("La validación formal (pruebas funcionales, inyección SQL manual, medición de tiempo transaccional) se encuentra descrita en el Plan de Pruebas como pendiente de ejecución y queda en estado de recomendación para la fase de despliegue en ambiente real."));
    children.push(new Paragraph({ text: "Resultados esperados", heading: HeadingLevel.HEADING_2 }));
    children.push(P("Se espera que la herramienta contribuya operativamente a unificar los registros de la organización, facilitando la creación de facturas e incrementando de forma consistente el control de inventarios de la empresa."));

    // 21. CONCLUSIONES
    children.push(new Paragraph({ text: "21. Conclusiones", heading: HeadingLevel.HEADING_1 }));
    children.push(P("La conjunción del frontend en React con el entorno Node.js permite disponer de una herramienta modular para centralizar la gestión de ventas, inventarios y abastecimiento."));
    children.push(P("La estructuración de las transacciones utilizando bloques controlados en SQLite actúa como una medida que contribuye a evitar inconsistencias de registros."));

    // 22. RECOMENDACIONES
    children.push(new Paragraph({ text: "22. Recomendaciones", heading: HeadingLevel.HEADING_1 }));
    children.push(P("Considerando la persistencia local de los datos en SQLite, se recomienda enfáticamente instaurar normativas organizacionales para extraer copias de respaldo seguras hacia unidades externas periódicamente."));

    // 23. REPOSITORIO
    children.push(new Paragraph({ text: "23. Repositorio del Proyecto", heading: HeadingLevel.HEADING_1 }));
    children.push(P("El proyecto se encuentra versionado y almacenado de manera remota en GitHub en la siguiente URL oficial:"));
    children.push(P("https://github.com/snxz-dev/sistema-sales", false));
    children.push(P("Este repositorio contiene el código fuente íntegro de la aplicación, la documentación técnica del proceso, los diagramas exportados y el historial para futuras actualizaciones del sistema."));

    // 24. REFERENCIAS
    children.push(new Paragraph({ text: "24. Referencias bibliográficas", heading: HeadingLevel.HEADING_1 }));
    const refs = [
        "Electron Documentation. (s.f.). Context Isolation. GitHub. Recuperado el 21 de septiembre de 2026, de https://www.electronjs.org/docs/latest/tutorial/context-isolation",
        "Hipp, R. (2024). SQLite As An Application File Format. SQLite Organization. Recuperado de https://sqlite.org/appfileformat.html",
        "Meta Platforms, Inc. (2025). Describing the UI. React Documentation. Recuperado de https://react.dev/learn/describing-the-ui",
        "Microsoft Corporation. (2024). TypeScript Handbook. Recuperado de https://www.typescriptlang.org/docs/",
        "Schwaber, K. & Sutherland, J. (2020). The Scrum Guide. Scrum.org. Recuperado de https://scrumguides.org/scrum-guide.html",
        "Vitejs. (2024). Vite: Next Generation Frontend Tooling. Recuperado de https://vitejs.dev/"
    ];
    for (let r of refs) {
        children.push(new Paragraph({
            text: r,
            indent: { hanging: mmToTwip(12.7) } // Sangría francesa APA
        }));
    }

    return children;
}

createDoc();
