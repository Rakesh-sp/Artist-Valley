
$('.banner_slider').slick({
  dots: false,
  infinite: true,
  autoplay: true,
  speed: 300,
  fade: true,
  cssEase: 'linear',
  slidesToShow: 1,
  prevArrow: '<button class="custom-prev"><i class="fas fa-chevron-left"></i></button>',
  nextArrow: '<button class="custom-next"><i class="fas fa-chevron-right"></i></button>',
  slidesToScroll: 1,
  
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
   
  ]
});

// ===============

$('.slider_prod_top').slick({
  dots: false,
  infinite: true,
  speed: 300,
  autoplay: true,
  slidesToShow: 5,
  prevArrow: '<button class="custom-prev"><i class="fas fa-chevron-left"></i></button>',
  nextArrow: '<button class="custom-next"><i class="fas fa-chevron-right"></i></button>',
  slidesToScroll: 1,
  
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }
   
  ]
});

// ==================



  const countdownElements = document.querySelectorAll(".countdown");

  countdownElements.forEach((element) => {
    const deadline = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance < 0) {
        clearInterval(timer);
        element.innerHTML = "Time's up!";
        return;
      }

      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      element.innerHTML = `${hours} : ${minutes} : ${seconds}`;
    }, 1000);
  });


 $(document).ready(function(){
    $('.testimonial-slider').slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      arrows: true,
        prevArrow: '<button class="custom-prev"><i class="fas fa-chevron-left"></i></button>',
  nextArrow: '<button class="custom-next"><i class="fas fa-chevron-right"></i></button>',
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  });

