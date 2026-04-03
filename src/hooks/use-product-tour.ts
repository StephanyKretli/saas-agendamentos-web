import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useRouter } from "next/navigation";

export const useProductTour = () => {
  const router = useRouter();

  const startTour = () => {
    const driverObj = driver({
      popoverClass: 'driverjs-theme', 
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      nextBtnText: 'Próximo →', 
      prevBtnText: '← Voltar',
      doneBtnText: 'Começar a Faturar! 🚀',
      steps: [
        {
          element: '#tour-stats',
            popover: {
              title: 'Acompanhe seu Dinheiro 💸', 
              description: 'Aqui você vê o faturamento bruto e as comissões em tempo real. Dinheiro no bolso!',
              side: "bottom",
              align: "start"
          }
        },
        {
          element: '#tour-today-agenda',
          popover: {
            title: 'Seu Dia Organizado 🗓️',
            description: 'Estes são os clientes VIP que você vai atender hoje.',
            side: "left",
            align: "start"
          }
        },
        {
          element: '#tour-link-agenda',
          popover: {
            title: 'Gestão Completa ✨',
            description: 'Clique aqui para abrir a agenda inteira e dominar o seu tempo.',
            side: "left",
                  
            // 🌟 A CORREÇÃO ESTÁ AQUI: O onNextClick tem de ficar dentro do bloco 'popover'
            onNextClick: () => {
              // 1. Muda de página (Next.js Router)
              router.push('/agenda');
              
              // 2. Espera a página carregar e avança o tour manualmente
              setTimeout(() => {
                driverObj.moveNext();
              }, 600);
            }
          }
        }
      ]
    });

    driverObj.drive();
  };

  return { startTour };
};